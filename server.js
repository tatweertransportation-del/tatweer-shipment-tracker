const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

loadEnvFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = process.env.DATA_FILE_PATH
  ? path.resolve(process.env.DATA_FILE_PATH)
  : path.join(__dirname, "data", "shipments.json");
const SUGGESTIONS_FILE = process.env.SUGGESTIONS_FILE_PATH
  ? path.resolve(process.env.SUGGESTIONS_FILE_PATH)
  : path.join(__dirname, "data", "suggestions.json");
const TRACKING_BASE_URL = process.env.TRACKING_BASE_URL || "";
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || "20";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

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

function ensureJsonFile(filePath, fallbackValue = "[]") {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, fallbackValue, "utf8");
  }
}

function readJsonFile(filePath) {
  ensureJsonFile(filePath);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw || "[]");
}

function writeJsonFile(filePath, data) {
  ensureJsonFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function loadShipments() {
  return readJsonFile(DATA_FILE);
}

function saveShipments(shipments) {
  writeJsonFile(DATA_FILE, shipments);
}

function loadSuggestions() {
  return readJsonFile(SUGGESTIONS_FILE);
}

function saveSuggestions(suggestions) {
  writeJsonFile(SUGGESTIONS_FILE, suggestions);
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

function normalizePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return "";
  }

  const cleaned = String(phoneNumber).replace(/[^\d]/g, "");
  if (!cleaned) {
    return "";
  }

  if (cleaned.startsWith("0")) {
    return `${DEFAULT_COUNTRY_CODE}${cleaned.slice(1)}`;
  }

  return cleaned;
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
      sendJson(res, 200, loadShipments().map((shipment) => withDerivedFields(shipment, req)));
      return;
    }

    if (req.method === "GET" && pathname === "/api/shipments/export.xls") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      const language = requestUrl.searchParams.get("lang") === "ar" ? "ar" : "en";
      const shipments = loadShipments();
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
      sendJson(res, 200, loadSuggestions());
      return;
    }

    if (req.method === "POST" && pathname === "/api/suggestions") {
      const { name, phone_number, tracking_number, message, language } = await readRequestBody(req);
      if (!String(message || "").trim()) {
        sendJson(res, 400, { error: "Suggestion message is required" });
        return;
      }

      const suggestions = loadSuggestions();
      const suggestion = {
        id: crypto.randomUUID(),
        name: String(name || "").trim(),
        phone_number: normalizePhoneNumber(phone_number),
        tracking_number: String(tracking_number || "").trim().toUpperCase(),
        message: String(message || "").trim(),
        language: language === "en" ? "en" : "ar",
        created_at: new Date().toISOString()
      };

      suggestions.unshift(suggestion);
      saveSuggestions(suggestions);
      sendJson(res, 201, suggestion);
      return;
    }

    if (pathname.startsWith("/api/shipments/") && req.method === "GET") {
      const trackingNumber = pathname.split("/").pop().toUpperCase();
      const requestedLanguage = requestUrl.searchParams.get("lang") === "en" ? "en" : "ar";
      const shipments = loadShipments();
      const shipmentIndex = shipments.findIndex(
        (item) => item.tracking_number.toUpperCase() === trackingNumber
      );

      if (shipmentIndex === -1) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      shipments[shipmentIndex].preferred_language = requestedLanguage;
      saveShipments(shipments);
      sendJson(res, 200, withDerivedFields(shipments[shipmentIndex], req));
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

      const shipments = loadShipments();
      const normalizedTracking = tracking_number.trim().toUpperCase();
      const exists = shipments.some(
        (item) => item.tracking_number.toUpperCase() === normalizedTracking
      );

      if (exists) {
        sendJson(res, 409, { error: "Tracking number already exists" });
        return;
      }

      const timestamp = new Date().toISOString();
      const shipment = {
        tracking_number: normalizedTracking,
        phone_number: normalizePhoneNumber(phone_number),
        arabic_status: arabic_status.trim(),
        english_status: english_status.trim(),
        last_update_time: timestamp,
        delivery_date,
        preferred_language: preferred_language === "en" ? "en" : "ar",
        history: [
          {
            arabic_status: "تم إنشاء الشحنة",
            english_status: "Shipment Created",
            timestamp,
            location: "Warehouse",
            progress: 10
          },
          {
            arabic_status: arabic_status.trim(),
            english_status: english_status.trim(),
            timestamp,
            location: "",
            progress: 25
          }
        ]
      };

      shipments.unshift(shipment);
      saveShipments(shipments);
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

      const shipments = loadShipments();
      const shipment = shipments.find(
        (item) => item.tracking_number.toUpperCase() === trackingNumber
      );

      if (!shipment) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      const timestamp = new Date().toISOString();
      if (arabic_status) shipment.arabic_status = arabic_status.trim();
      if (english_status) shipment.english_status = english_status.trim();
      if (delivery_date) shipment.delivery_date = delivery_date;
      if (phone_number) shipment.phone_number = normalizePhoneNumber(phone_number);
      if (preferred_language) shipment.preferred_language = preferred_language === "en" ? "en" : "ar";

      shipment.last_update_time = timestamp;
      shipment.history = shipment.history || [];
      shipment.history.push({
        arabic_status: shipment.arabic_status,
        english_status: shipment.english_status,
        timestamp,
        location: location || "",
        progress: Number.isFinite(Number(progress)) ? Number(progress) : computeProgress(shipment.history)
      });

      saveShipments(shipments);
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
});
