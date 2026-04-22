const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

loadEnvFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = path.join(__dirname, "data", "shipments.json");
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

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
}

function loadShipments() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw || "[]");
}

function saveShipments(shipments) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(shipments, null, 2), "utf8");
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

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const session = verifySessionToken(token);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.session = session;
  next();
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

function formatWhatsAppPhone(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);
  return normalized ? `whatsapp:+${normalized}` : "";
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

function buildWhatsAppMessage(shipment, language, req) {
  const trackingLink = buildTrackingLink(shipment.tracking_number, req);
  if (language === "en") {
    return `🚚 New shipment update
Tracking Number: ${shipment.tracking_number}
Status: ${shipment.english_status}
Track here:
${trackingLink}`;
  }

  return `🚚 تحديث جديد على شحنتك
رقم الشحنة: ${shipment.tracking_number}
الحالة: ${shipment.arabic_status}
تابع الشحنة:
${trackingLink}`;
}

async function sendViaTwilio(shipment, language, req) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = formatWhatsAppPhone(shipment.phone_number);

  if (!accountSid || !authToken || !from || !to) {
    throw new Error("Twilio WhatsApp configuration is incomplete.");
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      From: from,
      To: to,
      Body: buildWhatsAppMessage(shipment, language, req)
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio request failed: ${errorText}`);
  }

  return response.json();
}

async function sendViaWati(shipment, language, req) {
  const instanceId = process.env.WATI_INSTANCE_ID;
  const accessToken = process.env.WATI_ACCESS_TOKEN;
  const phone = normalizePhoneNumber(shipment.phone_number);

  if (!instanceId || !accessToken || !phone) {
    throw new Error("WATI configuration is incomplete.");
  }

  const response = await fetch(
    `https://live-server-${instanceId}.wati.io/api/v1/sendSessionMessage/${phone}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messageText: buildWhatsAppMessage(shipment, language, req)
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WATI request failed: ${errorText}`);
  }

  return response.json();
}

async function sendWhatsAppUpdate(shipment, req) {
  const language = shipment.preferred_language === "en" ? "en" : "ar";
  const provider = (process.env.WHATSAPP_PROVIDER || "mock").toLowerCase();

  if (provider === "twilio") {
    return sendViaTwilio(shipment, language, req);
  }

  if (provider === "wati") {
    return sendViaWati(shipment, language, req);
  }

  return {
    provider: "mock",
    sent: false,
    preview: buildWhatsAppMessage(shipment, language, req)
  };
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
        send_whatsapp,
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

      let notification = null;
      if (send_whatsapp) {
        try {
          notification = await sendWhatsAppUpdate(shipment, req);
        } catch (error) {
          notification = { error: error.message };
        }
      }

      saveShipments(shipments);
      sendJson(res, 200, {
        shipment: withDerivedFields(shipment, req),
        notification
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
