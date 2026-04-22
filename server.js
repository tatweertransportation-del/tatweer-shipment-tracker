const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { createDatabase } = require("./db");

loadEnvFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = process.env.DATA_FILE_PATH
  ? path.resolve(process.env.DATA_FILE_PATH)
  : path.join(__dirname, "data", "shipments.json");
const SUGGESTIONS_FILE = process.env.SUGGESTIONS_FILE_PATH
  ? path.resolve(process.env.SUGGESTIONS_FILE_PATH)
  : path.join(__dirname, "data", "suggestions.json");
const DATABASE_FILE = process.env.DATABASE_FILE_PATH
  ? path.resolve(process.env.DATABASE_FILE_PATH)
  : path.join(path.dirname(DATA_FILE), "tatweer-tracking.sqlite");
const AUDIT_LOG_FILE = process.env.AUDIT_LOG_FILE_PATH
  ? path.resolve(process.env.AUDIT_LOG_FILE_PATH)
  : path.join(path.dirname(DATABASE_FILE), "audit-log.jsonl");
const TRACKING_BASE_URL = process.env.TRACKING_BASE_URL || "";
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || "20";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const database = createDatabase({
  dbPath: DATABASE_FILE,
  dataFile: DATA_FILE,
  suggestionsFile: SUGGESTIONS_FILE,
  auditLogFile: AUDIT_LOG_FILE,
  defaultCountryCode: DEFAULT_COUNTRY_CODE
});

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
}

function createSessionToken(username) {
  const payload = {
    username,
    exp: Date.now() + 1000 * 60 * 60 * 12
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "development-secret")
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "development-secret")
    .update(encodedPayload)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

function deriveRequestOrigin(req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || (req.socket.encrypted ? "https" : "http");
  const host = req.headers["x-forwarded-host"] || req.headers.host || `localhost:${PORT}`;
  return `${protocol}://${host}`;
}

function getPublicBaseUrl(req) {
  return TRACKING_BASE_URL || deriveRequestOrigin(req);
}

function buildTrackingLink(trackingNumber, req) {
  const encoded = encodeURIComponent(trackingNumber);
  return `${getPublicBaseUrl(req)}/index.html?tracking=${encoded}`;
}

function computeProgress(history = []) {
  if (!history.length) {
    return 0;
  }
  return Math.max(0, Math.min(100, Number(history[history.length - 1].progress || 0)));
}

function withDerivedFields(shipment, req) {
  return {
    ...shipment,
    progress: computeProgress(shipment.history),
    tracking_link: buildTrackingLink(shipment.tracking_number, req)
  };
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        reject(new Error("Payload too large"));
      }
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error("Invalid JSON payload"));
      }
    });

    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function sendText(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function setCorsHeaders(req, res) {
  const requestOrigin = req.headers.origin;
  if (!requestOrigin) {
    return;
  }

  if (!ALLOWED_ORIGINS.length || ALLOWED_ORIGINS.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  }
}

function getSessionFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return verifySessionToken(token);
}

function isPublicAsset(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return [".html", ".css", ".js", ".json", ".png", ".jpg", ".jpeg", ".svg", ".ico"].includes(extension);
}

function serveStaticAsset(res, filePath) {
  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(__dirname, safePath);
  if (!absolutePath.startsWith(__dirname) || !fs.existsSync(absolutePath) || !isPublicAsset(absolutePath)) {
    sendText(res, 404, "Not Found");
    return;
  }

  const extension = path.extname(absolutePath).toLowerCase();
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon"
  };

  sendText(res, 200, fs.readFileSync(absolutePath), contentTypes[extension] || "application/octet-stream");
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getExportLabels(language) {
  if (language === "ar") {
    return {
      workbookName: "تقرير شحنات تطوير",
      shipmentsSheet: "الشحنات",
      updatesSheet: "التحديثات",
      shipmentsHeaders: [
        "رقم الشحنة",
        "هاتف العميل",
        "الحالة بالعربية",
        "الحالة بالإنجليزية",
        "آخر تحديث",
        "موعد التسليم",
        "اللغة المفضلة",
        "نسبة التقدم"
      ],
      updatesHeaders: [
        "رقم الشحنة",
        "التاريخ",
        "الحالة بالعربية",
        "الحالة بالإنجليزية",
        "الموقع",
        "نسبة التقدم"
      ]
    };
  }

  return {
    workbookName: "Tatweer Shipment Report",
    shipmentsSheet: "Shipments",
    updatesSheet: "Updates",
    shipmentsHeaders: [
      "Tracking Number",
      "Customer Phone",
      "Arabic Status",
      "English Status",
      "Last Update",
      "Delivery Date",
      "Preferred Language",
      "Progress"
    ],
    updatesHeaders: [
      "Tracking Number",
      "Date",
      "Arabic Status",
      "English Status",
      "Location",
      "Progress"
    ]
  };
}

function buildSpreadsheetRow(cells, cellStyle = "data") {
  const xmlCells = cells
    .map((value) => {
      const safeValue = value == null ? "" : value;
      const dataType = typeof safeValue === "number" ? "Number" : "String";
      return `<Cell ss:StyleID="${cellStyle}"><Data ss:Type="${dataType}">${escapeXml(safeValue)}</Data></Cell>`;
    })
    .join("");
  return `<Row>${xmlCells}</Row>`;
}

function buildWorksheetXml(name, headers, rows) {
  const headerRow = buildSpreadsheetRow(headers, "header");
  const bodyRows = rows.map((row) => buildSpreadsheetRow(row)).join("");
  return `
    <Worksheet ss:Name="${escapeXml(name)}">
      <Table>
        ${headerRow}
        ${bodyRows}
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <FreezePanes />
        <FrozenNoSplit />
        <SplitHorizontal>1</SplitHorizontal>
        <TopRowBottomPane>1</TopRowBottomPane>
        <ProtectObjects>False</ProtectObjects>
        <ProtectScenarios>False</ProtectScenarios>
      </WorksheetOptions>
    </Worksheet>
  `;
}

function buildShipmentsWorkbookXml(shipments, language) {
  const labels = getExportLabels(language);
  const shipmentRows = shipments.map((shipment) => [
    shipment.tracking_number,
    shipment.phone_number,
    shipment.arabic_status,
    shipment.english_status,
    shipment.last_update_time,
    shipment.delivery_date,
    shipment.preferred_language,
    computeProgress(shipment.history)
  ]);

  const updateRows = shipments.flatMap((shipment) =>
    (shipment.history || []).map((update) => [
      shipment.tracking_number,
      update.timestamp,
      update.arabic_status,
      update.english_status,
      update.location || "",
      Number.isFinite(Number(update.progress)) ? Number(update.progress) : ""
    ])
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Tatweer Tracking System</Author>
    <Company>Tatweer Truck Transport Company</Company>
    <Title>${escapeXml(labels.workbookName)}</Title>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      <Borders/>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#1F1F1F"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="header">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#B97656" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="data">
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
    </Style>
  </Styles>
  ${buildWorksheetXml(labels.shipmentsSheet, labels.shipmentsHeaders, shipmentRows)}
  ${buildWorksheetXml(labels.updatesSheet, labels.updatesHeaders, updateRows)}
</Workbook>`;
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(req, res);
  const requestUrl = new URL(req.url, getPublicBaseUrl(req));
  const pathname = decodeURIComponent(requestUrl.pathname);

  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && pathname === "/api/login") {
      const { username, password } = await readRequestBody(req);
      if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        sendJson(res, 200, {
          token: createSessionToken(username),
          username
        });
        return;
      }
      sendJson(res, 401, { error: "Invalid credentials" });
      return;
    }

    if (req.method === "GET" && pathname === "/api/session") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      sendJson(res, 200, { authenticated: true, username: session.username });
      return;
    }

    if (req.method === "GET" && pathname === "/api/shipments") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      const shipments = await database.getAllShipments();
      sendJson(
        res,
        200,
        shipments.map((shipment) => withDerivedFields(shipment, req))
      );
      return;
    }

    if (req.method === "GET" && pathname === "/api/shipments/export.xls") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      const language = requestUrl.searchParams.get("lang") === "ar" ? "ar" : "en";
      const shipments = await database.getAllShipments();
      const workbookXml = buildShipmentsWorkbookXml(shipments, language);
      const fileName = `tatweer-shipments-${new Date().toISOString().slice(0, 10)}.xls`;
      const body = Buffer.from(workbookXml, "utf8");
      res.writeHead(200, {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Length": body.length,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store"
      });
      res.end(body);
      return;
    }

    if (req.method === "GET" && pathname === "/api/suggestions") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      sendJson(res, 200, await database.getAllSuggestions());
      return;
    }

    if (req.method === "POST" && pathname === "/api/suggestions") {
      const { name, phone_number, tracking_number, message, language } = await readRequestBody(req);
      if (!String(message || "").trim()) {
        sendJson(res, 400, { error: "Suggestion message is required" });
        return;
      }

      const suggestion = await database.createSuggestion({
        name,
        phone_number,
        tracking_number,
        message,
        language
      });
      sendJson(res, 201, suggestion);
      return;
    }

    if (pathname.startsWith("/api/shipments/") && req.method === "GET") {
      const trackingNumber = pathname.split("/").pop().toUpperCase();
      const requestedLanguage = requestUrl.searchParams.get("lang") === "en" ? "en" : "ar";
      const shipment = await database.getShipment(trackingNumber);

      if (!shipment) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      sendJson(
        res,
        200,
        withDerivedFields(
          {
            ...shipment,
            preferred_language: requestedLanguage
          },
          req
        )
      );
      return;
    }

    if (req.method === "POST" && pathname === "/api/shipments") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      const {
        tracking_number,
        phone_number,
        arabic_status,
        english_status,
        delivery_date,
        preferred_language
      } = await readRequestBody(req);

      if (!tracking_number || !phone_number || !arabic_status || !english_status || !delivery_date) {
        sendJson(res, 400, { error: "Missing required fields" });
        return;
      }

      const exists = await database.getShipment(tracking_number.trim().toUpperCase());
      if (exists) {
        sendJson(res, 409, { error: "Tracking number already exists" });
        return;
      }

      const shipment = await database.createShipment({
        tracking_number,
        phone_number,
        arabic_status,
        english_status,
        delivery_date,
        preferred_language
      });

      sendJson(res, 201, withDerivedFields(shipment, req));
      return;
    }

    if (pathname.startsWith("/api/shipments/") && req.method === "PUT") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      const trackingNumber = pathname.split("/").pop().toUpperCase();
      const {
        arabic_status,
        english_status,
        delivery_date,
        phone_number,
        progress,
        location,
        preferred_language
      } = await readRequestBody(req);

      const shipment = await database.updateShipment(trackingNumber, {
        arabic_status,
        english_status,
        delivery_date,
        phone_number,
        progress,
        location,
        preferred_language
      });

      if (!shipment) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      sendJson(res, 200, {
        shipment: withDerivedFields(shipment, req),
        notification: null
      });
      return;
    }

    if (req.method === "GET") {
      if (pathname === "/" || pathname === "/index.html") {
        serveStaticAsset(res, "index.html");
        return;
      }

      if (pathname === "/admin" || pathname === "/admin.html") {
        serveStaticAsset(res, "admin.html");
        return;
      }

      serveStaticAsset(res, pathname.slice(1));
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(PORT, () => {
  const startupBaseUrl = TRACKING_BASE_URL || `http://localhost:${PORT}`;
  console.log(`Shipment tracking system is running at ${startupBaseUrl}`);
  console.log(`Database file: ${DATABASE_FILE}`);
});
