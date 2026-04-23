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
const TRACKING_BASE_URL = normalizeBaseUrl(process.env.TRACKING_BASE_URL);
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

function normalizeBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function isLocalhostUrl(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch (error) {
    return false;
  }
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password || "")).digest("hex");
}

function hashFilePassword(trackingNumber, password) {
  return crypto
    .createHash("sha256")
    .update(`${String(trackingNumber || "").toUpperCase()}::${String(password || "")}`)
    .digest("hex");
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyAdminCredentials(username, password) {
  if (username !== process.env.ADMIN_USERNAME) {
    return false;
  }

  const passwordHash = String(process.env.ADMIN_PASSWORD_HASH || "").trim();
  if (passwordHash) {
    return safeCompare(hashPassword(password), passwordHash);
  }

  return safeCompare(password, process.env.ADMIN_PASSWORD);
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
  const requestOrigin = deriveRequestOrigin(req);

  if (TRACKING_BASE_URL && (!isLocalhostUrl(TRACKING_BASE_URL) || isLocalhostUrl(requestOrigin))) {
    return TRACKING_BASE_URL;
  }

  return requestOrigin;
}

function buildTrackingLink(trackingNumber, req) {
  const encoded = encodeURIComponent(trackingNumber);
  return `${getPublicBaseUrl(req)}/?tracking=${encoded}`;
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

function toPublicShipment(shipment) {
  const { internal_notes, ...publicShipment } = shipment;
  return publicShipment;
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

function readRequestBodyWithLimit(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > maxBytes) {
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

function sendBinary(res, statusCode, body, contentType, fileName, forceDownload = false) {
  res.writeHead(statusCode, {
    "Content-Type": contentType || "application/octet-stream",
    "Content-Length": body.length,
    "Content-Disposition": `${forceDownload ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(fileName || "shipment-file")}`,
    "Cache-Control": "private, no-store"
  });
  res.end(body);
}

function sanitizeUploadedFile(file) {
  const fileName = path.basename(String(file.file_name || "shipment-file"));
  const mimeType = String(file.mime_type || "application/octet-stream").trim();
  const contentBase64 = String(file.content_base64 || "").replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(contentBase64, "base64");

  if (!buffer.length) {
    throw new Error("Uploaded file is empty.");
  }

  if (buffer.length > 8 * 1024 * 1024) {
    throw new Error("Each file must be 8MB or smaller.");
  }

  return {
    file_name: fileName,
    mime_type: mimeType,
    file_size: buffer.length,
    content_base64: buffer.toString("base64")
  };
}

function buildShipmentFilesWhatsappMessage(trackingNumber, password, req, language = "ar") {
  const documentsLink = `${getPublicBaseUrl(req)}/?documents=${encodeURIComponent(trackingNumber)}`;
  if (language === "en") {
    return `Tatweer Logistics Services

Dear customer,
Your shipment documents have been uploaded successfully and are now available securely through the tracking portal.

Tracking Number: ${trackingNumber}
Documents Password: ${password}

To view your shipment documents, please open this link:
${documentsLink}

For your privacy, please keep this password confidential and do not share it with anyone except authorized persons.

Thank you for choosing Tatweer.`;
  }

  return `تطوير للخدمات اللوجستية

عزيزنا العميل،
تم رفع أوراق شحنتكم بنجاح، وأصبحت متاحة الآن بشكل آمن من خلال بوابة التتبع.

رقم الشحنة: ${trackingNumber}
كلمة مرور أوراق الشحنة: ${password}

لعرض أوراق الشحنة، يرجى فتح الرابط التالي:
${documentsLink}

حرصًا على خصوصيتكم، يرجى الاحتفاظ بكلمة المرور وعدم مشاركتها إلا مع الأشخاص المصرح لهم.

نشكر ثقتكم في تطوير.`;
}

function buildCleanShipmentFilesWhatsappMessage(trackingNumber, password, req, language = "ar") {
  const documentsLink = `${getPublicBaseUrl(req)}/?documents=${encodeURIComponent(trackingNumber)}`;
  if (language === "en") {
    return `Tatweer Logistics Services

Dear customer,
Your shipment documents have been uploaded successfully and are now available securely through the tracking portal.

Tracking Number: ${trackingNumber}
Documents Password: ${password}

To view or download your shipment documents, please open this link:
${documentsLink}

For your privacy, please keep this password confidential and do not share it with anyone except authorized persons.

Thank you for choosing Tatweer.`;
  }

  return `Tatweer Logistics Services - تطوير للخدمات اللوجستية

عزيزنا العميل،
تم رفع أوراق شحنتكم بنجاح، وأصبحت متاحة الآن بشكل آمن من خلال بوابة التتبع الخاصة بتطوير.

رقم الشحنة: ${trackingNumber}
كلمة مرور أوراق الشحنة: ${password}

لعرض أو تحميل أوراق الشحنة، يرجى فتح الرابط التالي:
${documentsLink}

حفاظًا على خصوصيتكم، يرجى الاحتفاظ بكلمة المرور وعدم مشاركتها إلا مع الأشخاص المصرح لهم.

نشكركم على ثقتكم في تطوير.`;
}

function buildCleanShipmentFilesWhatsappMessage(trackingNumber, password, req, language = "ar") {
  const documentsLink = `${getPublicBaseUrl(req)}/?documents=${encodeURIComponent(trackingNumber)}`;
  if (language === "en") {
    const passwordLine = password
      ? `Documents Password: ${password}`
      : "Documents Password: Please use the same documents password previously sent to you.";

    return `Tatweer Logistics Services

Dear customer,
Your shipment documents have been updated successfully and are available securely through the tracking portal.

Tracking Number: ${trackingNumber}
${passwordLine}

To view or download your shipment documents, please open this link:
${documentsLink}

For your privacy, please keep your documents password confidential.

Thank you for choosing Tatweer.`;
  }

  const company = "Tatweer Logistics Services - \u062a\u0637\u0648\u064a\u0631 \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0644\u0648\u062c\u0633\u062a\u064a\u0629";
  const passwordLine = password
    ? `\u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0634\u062d\u0646\u0629: ${password}`
    : "\u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0634\u062d\u0646\u0629: \u064a\u0631\u062c\u0649 \u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0646\u0641\u0633 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0645\u0631\u0633\u0644\u0629 \u0644\u0643\u0645 \u0633\u0627\u0628\u0642\u064b\u0627.";

  return `${company}

\u0639\u0632\u064a\u0632\u0646\u0627 \u0627\u0644\u0639\u0645\u064a\u0644\u060c
\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u0623\u0648\u0631\u0627\u0642 \u0634\u062d\u0646\u062a\u0643\u0645 \u0628\u0646\u062c\u0627\u062d\u060c \u0648\u0623\u0635\u0628\u062d\u062a \u0645\u062a\u0627\u062d\u0629 \u0628\u0634\u0643\u0644 \u0622\u0645\u0646 \u0645\u0646 \u062e\u0644\u0627\u0644 \u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u062a\u062a\u0628\u0639 \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u062a\u0637\u0648\u064a\u0631.

\u0631\u0642\u0645 \u0627\u0644\u0634\u062d\u0646\u0629: ${trackingNumber}
${passwordLine}

\u0644\u0639\u0631\u0636 \u0623\u0648 \u062a\u062d\u0645\u064a\u0644 \u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0634\u062d\u0646\u0629\u060c \u064a\u0631\u062c\u0649 \u0641\u062a\u062d \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u062a\u0627\u0644\u064a:
${documentsLink}

\u062d\u0641\u0627\u0638\u064b\u0627 \u0639\u0644\u0649 \u062e\u0635\u0648\u0635\u064a\u062a\u0643\u0645\u060c \u064a\u0631\u062c\u0649 \u0627\u0644\u0627\u062d\u062a\u0641\u0627\u0638 \u0628\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0648\u0639\u062f\u0645 \u0645\u0634\u0627\u0631\u0643\u062a\u0647\u0627 \u0625\u0644\u0627 \u0645\u0639 \u0627\u0644\u0623\u0634\u062e\u0627\u0635 \u0627\u0644\u0645\u0635\u0631\u062d \u0644\u0647\u0645.

\u0646\u0634\u0643\u0631\u0643\u0645 \u0639\u0644\u0649 \u062b\u0642\u062a\u0643\u0645 \u0641\u064a \u062a\u0637\u0648\u064a\u0631.`;
}

function redirect(res, location) {
  res.writeHead(302, {
    Location: location,
    "Cache-Control": "no-store"
  });
  res.end();
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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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
      shipmentsSheet: "ملخص الشحنات",
      updatesSheet: "تفاصيل التحديثات",
      shipmentsHeaders: [
        "رقم الشحنة",
        "هاتف العميل",
        "الحالة بالعربية",
        "الحالة بالإنجليزية",
        "آخر تحديث",
        "موعد التسليم",
        "اللغة المفضلة",
        "نسبة التقدم",
        "ملاحظات داخلية",
        "عدد التحديثات"
      ],
      updatesHeaders: [
        "رقم الشحنة",
        "هاتف العميل",
        "التاريخ",
        "الحالة بالعربية",
        "الحالة بالإنجليزية",
        "الموقع",
        "نسبة التقدم",
        "موعد التسليم",
        "ملاحظات داخلية"
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
      "Progress",
      "Internal Notes",
      "Updates Count"
    ],
    updatesHeaders: [
      "Tracking Number",
      "Customer Phone",
      "Date",
      "Arabic Status",
      "English Status",
      "Location",
      "Progress",
      "Delivery Date",
      "Internal Notes"
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

function buildColumnsXml(count) {
  return Array.from({ length: count }, (_, index) => {
    const width = index === 0 ? 135 : index === 1 ? 120 : index >= 2 && index <= 4 ? 180 : 130;
    return `<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`;
  }).join("");
}

function buildWorksheetXml(name, headers, rows, language) {
  const headerRow = buildSpreadsheetRow(headers, "header");
  const bodyRows = rows.map((row) => buildSpreadsheetRow(row)).join("");
  const direction = language === "ar" ? "<DisplayRightToLeft />" : "";
  return `
    <Worksheet ss:Name="${escapeXml(name)}">
      <Table>
        ${buildColumnsXml(headers.length)}
        ${headerRow}
        ${bodyRows}
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        ${direction}
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
    computeProgress(shipment.history),
    shipment.internal_notes || "",
    (shipment.history || []).length
  ]);

  const updateRows = shipments.flatMap((shipment) =>
    (shipment.history || []).map((update) => [
      shipment.tracking_number,
      shipment.phone_number,
      update.timestamp,
      update.arabic_status,
      update.english_status,
      update.location || "",
      Number.isFinite(Number(update.progress)) ? Number(update.progress) : "",
      shipment.delivery_date,
      shipment.internal_notes || ""
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
    <Company>Tatweer Logistics Company</Company>
    <Title>${escapeXml(labels.workbookName)}</Title>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E6D5CC"/>
      </Borders>
      <Font ss:FontName="${language === "ar" ? "Cairo" : "Calibri"}" ss:Size="11" ss:Color="#1F1F1F"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="header">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:FontName="${language === "ar" ? "Cairo" : "Calibri"}" ss:Size="12" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#B97656" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="data">
      <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      <Interior ss:Color="#FFF8F4" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  ${buildWorksheetXml(labels.shipmentsSheet, labels.shipmentsHeaders, shipmentRows, language)}
  ${buildWorksheetXml(labels.updatesSheet, labels.updatesHeaders, updateRows, language)}
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
      if (verifyAdminCredentials(username, password)) {
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

    if (req.method === "GET" && pathname === "/api/ratings") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      sendJson(res, 200, await database.getAllRatings());
      return;
    }

    if (req.method === "POST" && pathname === "/api/ratings") {
      const { tracking_number, rating, comment, language } = await readRequestBody(req);
      const normalizedRating = Number(rating);
      if (!tracking_number || !Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
        sendJson(res, 400, { error: "Tracking number and rating from 1 to 5 are required" });
        return;
      }

      const createdRating = await database.createRating({
        tracking_number,
        rating: normalizedRating,
        comment,
        language
      });

      if (!createdRating) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      sendJson(res, 201, createdRating);
      return;
    }

    if (req.method === "POST" && pathname === "/api/shipment-files/lookup") {
      const { tracking_number, password } = await readRequestBody(req);
      const trackingNumber = String(tracking_number || "").trim().toUpperCase();
      if (!trackingNumber || !password) {
        sendJson(res, 400, { error: "Tracking number and password are required" });
        return;
      }

      const access = await database.getShipmentFileAccess(trackingNumber);
      if (!access || !safeCompare(access.password_hash, hashFilePassword(trackingNumber, password))) {
        sendJson(res, 401, { error: "Invalid documents password" });
        return;
      }

      const files = await database.getShipmentFiles(trackingNumber);
      sendJson(res, 200, { tracking_number: trackingNumber, files });
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/admin/shipment-files/")) {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      const trackingNumber = pathname.split("/").pop().toUpperCase();
      const shipment = await database.getShipment(trackingNumber);
      if (!shipment) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      sendJson(res, 200, {
        tracking_number: trackingNumber,
        files: await database.getShipmentFiles(trackingNumber)
      });
      return;
    }

    if (req.method === "DELETE" && pathname.startsWith("/api/admin/shipment-files/")) {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      const parts = pathname.split("/");
      const trackingNumber = String(parts[4] || "").trim().toUpperCase();
      const fileId = String(parts[5] || "").trim();
      if (!trackingNumber || !fileId) {
        sendJson(res, 400, { error: "Tracking number and file ID are required" });
        return;
      }

      const remainingFiles = await database.deleteShipmentFile(trackingNumber, fileId);
      if (remainingFiles === null) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }
      if (remainingFiles === false) {
        sendJson(res, 404, { error: "File not found" });
        return;
      }

      sendJson(res, 200, {
        tracking_number: trackingNumber,
        files: remainingFiles
      });
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/shipment-files/")) {
      const parts = pathname.split("/");
      const trackingNumber = String(parts[3] || "").trim().toUpperCase();
      const fileId = String(parts[4] || "").trim();
      const password = requestUrl.searchParams.get("password") || "";

      const access = await database.getShipmentFileAccess(trackingNumber);
      if (!access || !safeCompare(access.password_hash, hashFilePassword(trackingNumber, password))) {
        sendJson(res, 401, { error: "Invalid documents password" });
        return;
      }

      const file = await database.getShipmentFile(trackingNumber, fileId);
      if (!file) {
        sendJson(res, 404, { error: "File not found" });
        return;
      }

      sendBinary(
        res,
        200,
        Buffer.from(file.content_base64, "base64"),
        file.mime_type,
        file.file_name,
        requestUrl.searchParams.get("download") === "1"
      );
      return;
    }

    if (req.method === "POST" && pathname.startsWith("/api/admin/shipment-files/")) {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      const trackingNumber = pathname.split("/").pop().toUpperCase();
      const payload = await readRequestBodyWithLimit(req, 35 * 1024 * 1024);
      const password = String(payload.password || "").trim();
      const files = Array.isArray(payload.files) ? payload.files : [];

      if (!trackingNumber || !files.length) {
        sendJson(res, 400, { error: "Tracking number and files are required" });
        return;
      }

      const currentAccess = await database.getShipmentFileAccess(trackingNumber);
      if (!password && !currentAccess) {
        sendJson(res, 400, { error: "Documents password is required for the first upload" });
        return;
      }

      const cleanFiles = files.map(sanitizeUploadedFile);
      const savedFiles = await database.replaceShipmentFiles(
        trackingNumber,
        cleanFiles,
        password ? hashFilePassword(trackingNumber, password) : null
      );

      if (!savedFiles) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      const shipment = await database.getShipment(trackingNumber);
      sendJson(res, 200, {
        files: savedFiles,
        whatsapp_message: buildCleanShipmentFilesWhatsappMessage(
          trackingNumber,
          password,
          req,
          shipment?.preferred_language || "ar"
        ),
        phone_number: shipment?.phone_number || ""
      });
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
          toPublicShipment({
            ...shipment,
            preferred_language: requestedLanguage
          }),
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
        internal_notes,
        preferred_language
      } = await readRequestBody(req);

      const shipment = await database.updateShipment(trackingNumber, {
        arabic_status,
        english_status,
        delivery_date,
        phone_number,
        progress,
        location,
        internal_notes,
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

    if (pathname.startsWith("/api/shipments/") && req.method === "DELETE") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      const trackingNumber = pathname.split("/").pop().toUpperCase();
      const deleted = await database.deleteShipment(trackingNumber);
      if (!deleted) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      sendJson(res, 200, { deleted: true });
      return;
    }

    if (req.method === "GET") {
      if (pathname === "/index.html") {
        redirect(res, `/${requestUrl.search}`);
        return;
      }

      if (pathname === "/") {
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
  console.log(`Public tracking links: ${TRACKING_BASE_URL || "auto-detected from the request host"}`);
  console.log(`Database file: ${DATABASE_FILE}`);
});
