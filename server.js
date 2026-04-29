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
const APP_ID = "tatweer-shipment-tracking";
const APP_LICENSE_VERSION = "v1";
const APP_COPY_PROTECTION = String(process.env.APP_COPY_PROTECTION || "optional").toLowerCase();
const APP_ALLOWED_HOSTS = parseHostList(process.env.APP_ALLOWED_HOSTS);
const APP_LICENSE_KEY = String(process.env.APP_LICENSE_KEY || "").trim();
const APP_LICENSE_SECRET = String(process.env.APP_LICENSE_SECRET || "").trim();
const ALLOW_LOCALHOST_HOST =
  String(process.env.APP_ALLOW_LOCALHOST || (APP_COPY_PROTECTION === "required" ? "false" : "true"))
    .toLowerCase() === "true";
const RATE_LIMIT_WINDOWS = {
  login: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 7,
    blockMs: 15 * 60 * 1000
  }
};
const rateLimitStore = new Map();
const AUTH_COOKIE_NAME = "tatweer_admin_session";
const CSRF_COOKIE_NAME = "tatweer_admin_csrf";

verifyApplicationLicense();

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

function normalizeHost(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}

function parseHostList(value) {
  return String(value || "")
    .split(",")
    .map(normalizeHost)
    .filter(Boolean)
    .filter((host, index, list) => list.indexOf(host) === index)
    .sort();
}

function isLocalhostHost(value) {
  const host = normalizeHost(value);
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function createLicenseSignature(allowedHosts, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${APP_ID}:${APP_LICENSE_VERSION}:${allowedHosts.join(",")}`)
    .digest("base64url");
}

function verifyApplicationLicense() {
  const required = APP_COPY_PROTECTION === "required";
  const missingConfig = [];

  if (!APP_ALLOWED_HOSTS.length) {
    missingConfig.push("APP_ALLOWED_HOSTS");
  }
  if (!APP_LICENSE_KEY) {
    missingConfig.push("APP_LICENSE_KEY");
  }
  if (!APP_LICENSE_SECRET) {
    missingConfig.push("APP_LICENSE_SECRET");
  }

  if (missingConfig.length) {
    console.warn(
      `Application copy protection is not active because these settings are missing: ${missingConfig.join(", ")}.`
    );
    return;
  }

  const expectedKey = createLicenseSignature(APP_ALLOWED_HOSTS, APP_LICENSE_SECRET);
  if (safeCompare(APP_LICENSE_KEY, expectedKey)) {
    return;
  }

  const message = "Application copy protection failed: APP_LICENSE_KEY does not match APP_ALLOWED_HOSTS";
  if (required) {
    throw new Error(message);
  }

  console.warn(`${message}. Running in optional protection mode.`);
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

function createRandomToken(size = 32) {
  return crypto.randomBytes(size).toString("base64url");
}

function createSessionToken(username, csrfToken) {
  const payload = {
    username,
    csrf: csrfToken,
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

  if (!safeCompare(signature, expectedSignature)) {
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

function getRequestHost(req) {
  return normalizeHost(req.headers["x-forwarded-host"] || req.headers.host || "");
}

function isAllowedApplicationHost(req) {
  const host = getRequestHost(req);
  if (!host) {
    return false;
  }
  if (ALLOW_LOCALHOST_HOST && isLocalhostHost(host)) {
    return true;
  }
  return !APP_ALLOWED_HOSTS.length || APP_ALLOWED_HOSTS.includes(host);
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

function parseCookies(req) {
  const header = String(req.headers.cookie || "");
  return header.split(";").reduce((cookies, entry) => {
    const separatorIndex = entry.indexOf("=");
    if (separatorIndex === -1) {
      return cookies;
    }
    const key = entry.slice(0, separatorIndex).trim();
    const value = entry.slice(separatorIndex + 1).trim();
    if (!key) {
      return cookies;
    }
    try {
      cookies[key] = decodeURIComponent(value);
    } catch (error) {
      cookies[key] = value;
    }
    return cookies;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }
  if (options.httpOnly) {
    parts.push("HttpOnly");
  }
  if (options.secure) {
    parts.push("Secure");
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }
  parts.push(`Path=${options.path || "/"}`);
  return parts.join("; ");
}

function isSecureRequest(req) {
  return (req.headers["x-forwarded-proto"] || "").toLowerCase() === "https" || Boolean(req.socket.encrypted);
}

function setAuthCookies(res, req, sessionToken, csrfToken) {
  const secure = isSecureRequest(req);
  res.setHeader("Set-Cookie", [
    serializeCookie(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure,
      sameSite: "Strict",
      path: "/",
      maxAge: 60 * 60 * 12
    }),
    serializeCookie(CSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure,
      sameSite: "Strict",
      path: "/",
      maxAge: 60 * 60 * 12
    })
  ]);
}

function clearAuthCookies(res, req) {
  const secure = isSecureRequest(req);
  res.setHeader("Set-Cookie", [
    serializeCookie(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure,
      sameSite: "Strict",
      path: "/",
      maxAge: 0
    }),
    serializeCookie(CSRF_COOKIE_NAME, "", {
      httpOnly: false,
      secure,
      sameSite: "Strict",
      path: "/",
      maxAge: 0
    })
  ]);
}

function setSecurityHeaders(req, res) {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "frame-src 'none'",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests"
  ].join("; ");

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", csp);
  if ((req.headers["x-forwarded-proto"] || "").toLowerCase() === "https" || req.socket.encrypted) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
}

function getClientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")
    .map((part) => part.trim())
    .find(Boolean);
  return forwarded || req.socket.remoteAddress || "unknown";
}

function cleanupRateLimitStore(now = Date.now()) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.blockedUntil && entry.blockedUntil > now) {
      continue;
    }
    if (!entry.requests?.length) {
      rateLimitStore.delete(key);
      continue;
    }
    if (now - entry.requests[entry.requests.length - 1] > 60 * 60 * 1000) {
      rateLimitStore.delete(key);
    }
  }
}

function applyRateLimit(req, res, bucketName, subject = "") {
  const config = RATE_LIMIT_WINDOWS[bucketName];
  if (!config) {
    return false;
  }

  const now = Date.now();
  cleanupRateLimitStore(now);

  const key = `${bucketName}:${getClientIp(req)}:${String(subject || "").trim().toUpperCase()}`;
  const entry = rateLimitStore.get(key) || { requests: [], blockedUntil: 0 };

  if (entry.blockedUntil && entry.blockedUntil > now) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.blockedUntil - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSeconds));
    sendJson(res, 429, {
      error: "Too many requests. Please wait a little and try again."
    });
    return true;
  }

  entry.requests = entry.requests.filter((timestamp) => now - timestamp < config.windowMs);
  entry.requests.push(now);

  if (entry.requests.length > config.maxRequests) {
    entry.blockedUntil = now + config.blockMs;
    rateLimitStore.set(key, entry);
    const retryAfterSeconds = Math.max(1, Math.ceil(config.blockMs / 1000));
    res.setHeader("Retry-After", String(retryAfterSeconds));
    sendJson(res, 429, {
      error: "Too many requests. Please wait a little and try again."
    });
    return true;
  }

  rateLimitStore.set(key, entry);
  return false;
}

function validateDocumentsPassword(password) {
  const value = String(password || "").trim();
  if (!value) {
    return null;
  }

  if (value.length < 6) {
    return "Documents password must be at least 6 characters.";
  }

  if (/^\d+$/.test(value) && value.length < 8) {
    return "Numeric-only documents passwords must be at least 8 digits.";
  }

  return null;
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

function buildShipmentDocumentsWhatsappMessage(trackingNumber, password, req, language = "ar") {
  const documentsLink = `${getPublicBaseUrl(req)}/?documents=${encodeURIComponent(trackingNumber)}`;
  const hasNewPassword = Boolean(String(password || "").trim());

  if (language === "en") {
    const passwordLine = hasNewPassword
      ? `Documents Password: ${password}`
      : "Documents Password: Please use the same documents password previously sent to you.";

    return `Tatweer Logistics Services

Dear customer,

Your shipment documents are now available on Tatweer Tracking System.

Shipment Number: ${trackingNumber}
${passwordLine}

You can view or download your shipment documents securely through the following link:
${documentsLink}

Please keep this password confidential to protect your shipment information.

Thank you for choosing Tatweer Logistics Services.`;
  }

  const passwordLine = hasNewPassword
    ? `كلمة مرور الأوراق: ${password}`
    : "كلمة مرور الأوراق: يرجى استخدام نفس كلمة المرور المرسلة لكم سابقًا.";

  return `تطوير للخدمات اللوجستية

عزيزنا العميل،

نود إبلاغكم بأن أوراق الشحنة أصبحت متاحة الآن على نظام Tatweer Tracking System.

رقم الشحنة: ${trackingNumber}
${passwordLine}

يمكنكم عرض أو تحميل أوراق الشحنة بأمان من خلال الرابط التالي:
${documentsLink}

يرجى الاحتفاظ بكلمة المرور وعدم مشاركتها حفاظًا على سرية بيانات شحنتكم.

شكرًا لاختياركم تطوير للخدمات اللوجستية.`;
}

function buildShipmentDocumentsWhatsappMessage(trackingNumber, password, req, language = "ar") {
  const documentsParams = new URLSearchParams({ documents: trackingNumber });
  if (password) {
    documentsParams.set("password", password);
  }
  const documentsLink = `${getPublicBaseUrl(req)}/?${documentsParams.toString()}`;

  if (language === "en") {
    return `Tatweer Logistics Services

Dear customer,

Your shipment documents are now available on Tatweer Tracking System.

Shipment Number: ${trackingNumber}
Documents Password: ${password}

Open this secure link to view or download your shipment documents:
${documentsLink}

Important: This password is your responsibility. Please do not share it with anyone to protect your shipment papers and keep your personal data confidential.

Thank you for choosing Tatweer Logistics Services.`;
  }

  return `\u062a\u0637\u0648\u064a\u0631 \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0644\u0648\u062c\u0633\u062a\u064a\u0629

\u0639\u0632\u064a\u0632\u0646\u0627 \u0627\u0644\u0639\u0645\u064a\u0644\u060c

\u0646\u0648\u062f \u0625\u0628\u0644\u0627\u063a\u0643\u0645 \u0628\u0623\u0646 \u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0634\u062d\u0646\u0629 \u0623\u0635\u0628\u062d\u062a \u0645\u062a\u0627\u062d\u0629 \u0627\u0644\u0622\u0646 \u0639\u0644\u0649 \u0646\u0638\u0627\u0645 Tatweer Tracking System.

\u0631\u0642\u0645 \u0627\u0644\u0634\u062d\u0646\u0629: ${trackingNumber}
\u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631 \u0627\u0644\u0623\u0648\u0631\u0627\u0642: ${password}

\u0627\u0641\u062a\u062d \u0647\u0630\u0627 \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0622\u0645\u0646 \u0644\u0639\u0631\u0636 \u0623\u0648 \u062a\u062d\u0645\u064a\u0644 \u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0634\u062d\u0646\u0629:
${documentsLink}

\u0647\u0627\u0645: \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0647\u064a \u0645\u0633\u0624\u0648\u0644\u064a\u062a\u0643\u060c \u064a\u0631\u062c\u0649 \u0639\u062f\u0645 \u0645\u0634\u0627\u0631\u0643\u062a\u0647\u0627 \u0645\u0639 \u0623\u064a \u0634\u062e\u0635 \u062d\u0641\u0627\u0638\u064b\u0627 \u0639\u0644\u0649 \u0623\u0648\u0631\u0627\u0642\u0643 \u0648\u0633\u0631\u064a\u0629 \u0628\u064a\u0627\u0646\u0627\u062a\u0643.

\u0634\u0643\u0631\u064b\u0627 \u0644\u0627\u062e\u062a\u064a\u0627\u0631\u0643\u0645 \u062a\u0637\u0648\u064a\u0631 \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0644\u0648\u062c\u0633\u062a\u064a\u0629.`;
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

function getCsrfTokenFromRequest(req) {
  return String(req.headers["x-csrf-token"] || "").trim();
}

function isTrustedOrigin(req) {
  const origin = String(req.headers.origin || "").trim();
  if (!origin) {
    return true;
  }
  const requestOrigin = deriveRequestOrigin(req);
  return origin === requestOrigin || ALLOWED_ORIGINS.includes(origin);
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const token = cookies[AUTH_COOKIE_NAME] || headerToken;
  return verifySessionToken(token);
}

function requireCsrf(req, res, session) {
  if (!isTrustedOrigin(req)) {
    sendJson(res, 403, { error: "Untrusted origin" });
    return false;
  }
  const cookies = parseCookies(req);
  const csrfCookie = String(cookies[CSRF_COOKIE_NAME] || "");
  const csrfHeader = getCsrfTokenFromRequest(req);
  if (!session?.csrf || !csrfCookie || !csrfHeader) {
    sendJson(res, 403, { error: "Invalid security token" });
    return false;
  }
  if (!safeCompare(session.csrf, csrfCookie) || !safeCompare(session.csrf, csrfHeader)) {
    sendJson(res, 403, { error: "Invalid security token" });
    return false;
  }
  return true;
}

function normalizeTrackingNumber(value) {
  return normalizeLocalizedDigits(value)
    .trim()
    .toUpperCase();
}

function isValidTrackingNumber(value) {
  return /^[A-Z0-9-]{3,40}$/.test(value);
}

function sanitizeText(value, maxLength = 250) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeMultilineText(value, maxLength = 1000) {
  return String(value || "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxLength);
}

function sanitizePhoneNumber(value) {
  const normalized = normalizeLocalizedDigits(value).replace(/[^\d+]/g, "").trim();
  return normalized.slice(0, 18);
}

function isValidPhoneNumber(value) {
  return /^\+?\d{8,18}$/.test(value);
}

function sanitizeLanguage(value) {
  return value === "en" ? "en" : "ar";
}

function normalizeProgressValue(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

function isValidIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(normalizeLocalizedDigits(value).trim());
}

function isValidTimestamp(value) {
  return !Number.isNaN(new Date(String(value || "")).getTime());
}

function normalizeLocalizedDigits(value) {
  return String(value || "").replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabicIndicDigits = "٠١٢٣٤٥٦٧٨٩";
    const easternArabicIndicDigits = "۰۱۲۳۴۵۶۷۸۹";
    const arabicIndicIndex = arabicIndicDigits.indexOf(digit);
    if (arabicIndicIndex !== -1) {
      return String(arabicIndicIndex);
    }
    const easternArabicIndicIndex = easternArabicIndicDigits.indexOf(digit);
    if (easternArabicIndicIndex !== -1) {
      return String(easternArabicIndicIndex);
    }
    return digit;
  });
}

function isPublicAsset(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, "/");
  const extension = path.extname(normalizedPath).toLowerCase();
  const publicRootFiles = new Set(["index.html", "admin.html", "style.css", "script.js", "config.js"]);

  if (publicRootFiles.has(normalizedPath)) {
    return true;
  }

  return normalizedPath.startsWith("assets/") && [".png", ".jpg", ".jpeg", ".svg", ".ico", ".webp"].includes(extension);
}

function serveStaticAsset(res, filePath) {
  const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.resolve(__dirname, safePath);
  const relativePath = path.relative(__dirname, absolutePath);
  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath) ||
    !isPublicAsset(relativePath) ||
    !fs.existsSync(absolutePath) ||
    !fs.statSync(absolutePath).isFile()
  ) {
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
    ".webp": "image/webp",
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
  setSecurityHeaders(req, res);
  setCorsHeaders(req, res);
  const requestUrl = new URL(req.url, getPublicBaseUrl(req));
  const pathname = decodeURIComponent(requestUrl.pathname);

  try {
    if (!isAllowedApplicationHost(req)) {
      sendJson(res, 403, { error: "This application is not licensed for this host" });
      return;
    }

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
      if (applyRateLimit(req, res, "login")) {
        return;
      }
      if (!isTrustedOrigin(req)) {
        sendJson(res, 403, { error: "Untrusted origin" });
        return;
      }

      const { username, password } = await readRequestBody(req);
      const normalizedUsername = sanitizeText(username, 64);
      if (verifyAdminCredentials(normalizedUsername, password)) {
        const csrfToken = createRandomToken(24);
        const sessionToken = createSessionToken(normalizedUsername, csrfToken);
        setAuthCookies(res, req, sessionToken, csrfToken);
        sendJson(res, 200, {
          authenticated: true,
          username: normalizedUsername,
          csrf_token: csrfToken
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
      sendJson(res, 200, {
        authenticated: true,
        username: session.username,
        csrf_token: session.csrf
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/logout") {
      const session = getSessionFromRequest(req);
      if (session && !requireCsrf(req, res, session)) {
        return;
      }
      clearAuthCookies(res, req);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && pathname === "/api/shipments") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      const shipments = await database.getAllShipments();
      const shipmentsWithFileCounts = await Promise.all(
        shipments.map(async (shipment) => ({
          ...shipment,
          files_count: (await database.getShipmentFiles(shipment.tracking_number)).length
        }))
      );
      sendJson(
        res,
        200,
        shipmentsWithFileCounts.map((shipment) => withDerivedFields(shipment, req))
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

    if (req.method === "GET" && pathname === "/api/backup") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      const backup = await database.getBackup();
      const body = Buffer.from(JSON.stringify(backup, null, 2), "utf8");
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": body.length,
        "Content-Disposition": `attachment; filename="tatweer-backup-${new Date().toISOString().slice(0, 10)}.json"`,
        "Cache-Control": "no-store"
      });
      res.end(body);
      return;
    }

    if (req.method === "POST" && pathname === "/api/backup/import") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      if (!requireCsrf(req, res, session)) {
        return;
      }
      const backup = await readRequestBodyWithLimit(req, 80 * 1024 * 1024);
      const restored = await database.restoreBackup(backup);
      sendJson(res, 200, {
        ok: true,
        shipments_count: restored.shipments.length,
        files_count: restored.shipment_files.length
      });
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
      const normalizedTrackingNumber = normalizeTrackingNumber(tracking_number);
      const normalizedRating = Number(rating);
      if (
        !isValidTrackingNumber(normalizedTrackingNumber) ||
        !Number.isFinite(normalizedRating) ||
        normalizedRating < 1 ||
        normalizedRating > 5
      ) {
        sendJson(res, 400, { error: "Tracking number and rating from 1 to 5 are required" });
        return;
      }

      const createdRating = await database.createRating({
        tracking_number: normalizedTrackingNumber,
        rating: normalizedRating,
        comment: sanitizeMultilineText(comment, 600),
        language: sanitizeLanguage(language)
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
      const trackingNumber = normalizeTrackingNumber(tracking_number);
      const documentsPassword = String(password || "").trim();

      if (!isValidTrackingNumber(trackingNumber) || !documentsPassword) {
        sendJson(res, 400, { error: "Tracking number and password are required" });
        return;
      }

      const access = await database.getShipmentFileAccess(trackingNumber);
      if (!access || !safeCompare(access.password_hash, hashFilePassword(trackingNumber, documentsPassword))) {
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

      const trackingNumber = normalizeTrackingNumber(pathname.split("/").pop());
      if (!isValidTrackingNumber(trackingNumber)) {
        sendJson(res, 400, { error: "Invalid tracking number" });
        return;
      }
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
      if (!requireCsrf(req, res, session)) {
        return;
      }

      const parts = pathname.split("/");
      const trackingNumber = normalizeTrackingNumber(parts[4]);
      const fileId = String(parts[5] || "").trim();
      if (!isValidTrackingNumber(trackingNumber) || !fileId) {
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
      const trackingNumber = normalizeTrackingNumber(parts[3]);
      const fileId = String(parts[4] || "").trim();
      const password = requestUrl.searchParams.get("password") || "";

      if (!isValidTrackingNumber(trackingNumber) || !fileId) {
        sendJson(res, 400, { error: "Invalid shipment file request" });
        return;
      }

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
      if (!requireCsrf(req, res, session)) {
        return;
      }

      const trackingNumber = normalizeTrackingNumber(pathname.split("/").pop());
      const payload = await readRequestBodyWithLimit(req, 35 * 1024 * 1024);
      const password = String(payload.password || "").trim();
      const files = Array.isArray(payload.files) ? payload.files : [];

      if (!isValidTrackingNumber(trackingNumber) || !files.length) {
        sendJson(res, 400, { error: "Tracking number and files are required" });
        return;
      }

      const currentAccess = await database.getShipmentFileAccess(trackingNumber);
      if (!password && !currentAccess) {
        sendJson(res, 400, { error: "Documents password is required for the first upload" });
        return;
      }

      const passwordValidationError = validateDocumentsPassword(password);
      if (passwordValidationError) {
        sendJson(res, 400, { error: passwordValidationError });
        return;
      }

      const messagePassword = password || currentAccess?.password_value || "";
      if (!messagePassword) {
        sendJson(res, 400, {
          error:
            "Documents password is missing. Please enter the documents password once, then future messages can reuse it."
        });
        return;
      }
      const cleanFiles = files.map(sanitizeUploadedFile);
      const savedFiles = await database.replaceShipmentFiles(
        trackingNumber,
        cleanFiles,
        password ? hashFilePassword(trackingNumber, password) : null,
        password
      );

      if (!savedFiles) {
        sendJson(res, 404, { error: "Shipment not found" });
        return;
      }

      const shipment = await database.getShipment(trackingNumber);
      sendJson(res, 200, {
        files: savedFiles,
        whatsapp_message: buildShipmentDocumentsWhatsappMessage(
          trackingNumber,
          messagePassword,
          req,
          shipment?.preferred_language || "ar"
        ),
        phone_number: shipment?.phone_number || "",
        documents_password: messagePassword
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/suggestions") {
      const { name, phone_number, tracking_number, message, language } = await readRequestBody(req);
      const suggestionMessage = sanitizeMultilineText(message, 1000);
      const suggestionPhone = sanitizePhoneNumber(phone_number);
      const suggestionTrackingNumber = normalizeTrackingNumber(tracking_number);

      if (!suggestionMessage) {
        sendJson(res, 400, { error: "Suggestion message is required" });
        return;
      }
      if (suggestionPhone && !isValidPhoneNumber(suggestionPhone)) {
        sendJson(res, 400, { error: "Invalid phone number" });
        return;
      }
      if (suggestionTrackingNumber && !isValidTrackingNumber(suggestionTrackingNumber)) {
        sendJson(res, 400, { error: "Invalid tracking number" });
        return;
      }

      const suggestion = await database.createSuggestion({
        name: sanitizeText(name, 120),
        phone_number: suggestionPhone,
        tracking_number: suggestionTrackingNumber,
        message: suggestionMessage,
        language: sanitizeLanguage(language)
      });
      sendJson(res, 201, suggestion);
      return;
    }

    if (pathname.startsWith("/api/shipments/") && req.method === "GET") {
      const trackingNumber = normalizeTrackingNumber(pathname.split("/").pop());
      const requestedLanguage = sanitizeLanguage(requestUrl.searchParams.get("lang"));
      if (!isValidTrackingNumber(trackingNumber)) {
        sendJson(res, 400, { error: "Invalid tracking number" });
        return;
      }
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
      if (!requireCsrf(req, res, session)) {
        return;
      }

      const requestBody = await readRequestBody(req);
      const {
        tracking_number,
        phone_number,
        arabic_status,
        english_status,
        delivery_date,
        update_timestamp,
        preferred_language,
        progress
      } = requestBody;

      const normalizedTrackingNumber = normalizeTrackingNumber(tracking_number);
      const normalizedPhoneNumber = sanitizePhoneNumber(phone_number);
      const normalizedArabicStatus = sanitizeText(arabic_status, 160);
      const normalizedEnglishStatus = sanitizeText(english_status, 160);
      const normalizedDeliveryDate = normalizeLocalizedDigits(delivery_date).trim();
      const normalizedPreferredLanguage = sanitizeLanguage(preferred_language);
      const normalizedProgress = normalizeProgressValue(progress);
      const normalizedUpdateTimestamp = update_timestamp ? String(update_timestamp).trim() : "";

      const validationErrors = [];
      if (!isValidTrackingNumber(normalizedTrackingNumber)) {
        validationErrors.push("tracking_number");
      }
      if (!isValidPhoneNumber(normalizedPhoneNumber)) {
        validationErrors.push("phone_number");
      }
      if (!normalizedArabicStatus) {
        validationErrors.push("arabic_status");
      }
      if (!normalizedEnglishStatus) {
        validationErrors.push("english_status");
      }
      if (!isValidIsoDate(normalizedDeliveryDate)) {
        validationErrors.push("delivery_date");
      }
      if (normalizedUpdateTimestamp && !isValidTimestamp(normalizedUpdateTimestamp)) {
        validationErrors.push("update_timestamp");
      }

      if (
        validationErrors.length
      ) {
        sendJson(res, 400, {
          error: `Invalid or missing fields: ${validationErrors.join(", ")}`
        });
        return;
      }

      const exists = await database.getShipment(normalizedTrackingNumber);
      if (exists) {
        sendJson(res, 409, { error: "Tracking number already exists" });
        return;
      }

      const shipment = await database.createShipment({
        tracking_number: normalizedTrackingNumber,
        phone_number: normalizedPhoneNumber,
        arabic_status: normalizedArabicStatus,
        english_status: normalizedEnglishStatus,
        delivery_date: normalizedDeliveryDate,
        update_timestamp: normalizedUpdateTimestamp || undefined,
        preferred_language: normalizedPreferredLanguage,
        progress: normalizedProgress
      });

      sendJson(res, 201, withDerivedFields(shipment, req));
      return;
    }

    if (pathname.startsWith("/api/shipments/") && pathname.includes("/updates/") && req.method === "PUT") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      if (!requireCsrf(req, res, session)) {
        return;
      }

      const parts = pathname.split("/").filter(Boolean);
      const trackingNumber = normalizeTrackingNumber(parts[2]);
      const updateId = String(parts[4] || "").trim();
      const requestBody = await readRequestBody(req);
      const {
        arabic_status,
        english_status,
        update_timestamp,
        progress,
        location,
        internal_notes,
        preferred_language
      } = requestBody;
      const normalizedUpdateTimestamp = update_timestamp ? String(update_timestamp).trim() : undefined;

      if (!isValidTrackingNumber(trackingNumber) || !updateId) {
        sendJson(res, 400, { error: "Invalid shipment update request" });
        return;
      }
      if (normalizedUpdateTimestamp && !isValidTimestamp(normalizedUpdateTimestamp)) {
        sendJson(res, 400, { error: "Invalid update timestamp" });
        return;
      }

      const shipment = await database.updateShipmentUpdate(trackingNumber, updateId, {
        arabic_status: sanitizeText(arabic_status, 160),
        english_status: sanitizeText(english_status, 160),
        update_timestamp: normalizedUpdateTimestamp,
        progress: normalizeProgressValue(progress),
        location: sanitizeText(location, 160),
        internal_notes: sanitizeMultilineText(internal_notes, 1000),
        preferred_language: preferred_language ? sanitizeLanguage(preferred_language) : undefined
      });

      if (!shipment) {
        sendJson(res, 404, { error: "Shipment update not found" });
        return;
      }

      sendJson(res, 200, {
        shipment: withDerivedFields(shipment, req),
        notification: null
      });
      return;
    }

    if (pathname.startsWith("/api/shipments/") && req.method === "PUT") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      if (!requireCsrf(req, res, session)) {
        return;
      }

      const trackingNumber = normalizeTrackingNumber(pathname.split("/").pop());
      const requestBody = await readRequestBody(req);
      const {
        arabic_status,
        english_status,
        delivery_date,
        update_timestamp,
        phone_number,
        progress,
        location,
        internal_notes,
        preferred_language
      } = requestBody;
      const normalizedDeliveryDate = delivery_date ? normalizeLocalizedDigits(String(delivery_date)).trim() : undefined;
      const normalizedUpdateTimestamp = update_timestamp ? String(update_timestamp).trim() : undefined;
      const normalizedPhoneNumber = phone_number ? sanitizePhoneNumber(phone_number) : undefined;

      if (!isValidTrackingNumber(trackingNumber)) {
        sendJson(res, 400, { error: "Invalid tracking number" });
        return;
      }
      if (normalizedDeliveryDate && !isValidIsoDate(normalizedDeliveryDate)) {
        sendJson(res, 400, { error: "Invalid delivery date" });
        return;
      }
      if (normalizedPhoneNumber && !isValidPhoneNumber(normalizedPhoneNumber)) {
        sendJson(res, 400, { error: "Invalid phone number" });
        return;
      }
      if (normalizedUpdateTimestamp && !isValidTimestamp(normalizedUpdateTimestamp)) {
        sendJson(res, 400, { error: "Invalid update timestamp" });
        return;
      }

      const shipment = await database.updateShipment(trackingNumber, {
        arabic_status: sanitizeText(arabic_status, 160),
        english_status: sanitizeText(english_status, 160),
        delivery_date: normalizedDeliveryDate,
        update_timestamp: normalizedUpdateTimestamp,
        phone_number: normalizedPhoneNumber,
        progress: normalizeProgressValue(progress),
        location: sanitizeText(location, 160),
        internal_notes: sanitizeMultilineText(internal_notes, 1000),
        preferred_language: preferred_language ? sanitizeLanguage(preferred_language) : undefined
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

    if (pathname.startsWith("/api/shipments/") && pathname.includes("/updates/") && req.method === "DELETE") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      if (!requireCsrf(req, res, session)) {
        return;
      }

      const parts = pathname.split("/").filter(Boolean);
      const trackingNumber = normalizeTrackingNumber(parts[2]);
      const updateId = String(parts[4] || "").trim();
      if (!isValidTrackingNumber(trackingNumber) || !updateId) {
        sendJson(res, 400, { error: "Invalid shipment update request" });
        return;
      }

      const shipment = await database.deleteShipmentUpdate(trackingNumber, updateId);
      if (!shipment) {
        sendJson(res, 404, { error: "Shipment update not found or cannot be deleted" });
        return;
      }

      sendJson(res, 200, {
        shipment: withDerivedFields(shipment, req)
      });
      return;
    }

    if (pathname.startsWith("/api/shipments/") && req.method === "DELETE") {
      const session = getSessionFromRequest(req);
      if (!session) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }
      if (!requireCsrf(req, res, session)) {
        return;
      }

      const trackingNumber = normalizeTrackingNumber(pathname.split("/").pop());
      if (!isValidTrackingNumber(trackingNumber)) {
        sendJson(res, 400, { error: "Invalid tracking number" });
        return;
      }
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
    console.error("Unhandled request error:", error);
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, () => {
  const startupBaseUrl = TRACKING_BASE_URL || `http://localhost:${PORT}`;
  console.log(`Shipment tracking system is running at ${startupBaseUrl}`);
  console.log(`Public tracking links: ${TRACKING_BASE_URL || "auto-detected from the request host"}`);
  console.log(`Database file: ${DATABASE_FILE}`);
});
