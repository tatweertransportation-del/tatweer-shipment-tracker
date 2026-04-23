const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJsonArray(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch (error) {
    return [];
  }
}

function normalizePhoneNumber(phoneNumber, defaultCountryCode) {
  if (!phoneNumber) {
    return "";
  }

  const cleaned = String(phoneNumber).replace(/[^\d]/g, "");
  if (!cleaned) {
    return "";
  }

  if (cleaned.startsWith("0")) {
    return `${defaultCountryCode}${cleaned.slice(1)}`;
  }

  return cleaned;
}

function createSupabaseDatabase(options) {
  const {
    dataFile,
    suggestionsFile,
    auditLogFile,
    defaultCountryCode = "20"
  } = options;

  const supabaseUrl = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  ensureDir(auditLogFile ? path.dirname(auditLogFile) : ".");

  if (!fs.existsSync(auditLogFile)) {
    fs.writeFileSync(auditLogFile, "", "utf8");
  }

  function appendAuditLog(type, payload) {
    const entry = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
      payload
    };
    fs.appendFileSync(auditLogFile, `${JSON.stringify(entry)}\n`, "utf8");
  }

  async function request(method, resource, { query = {}, body, headers = {}, prefer } = {}) {
    const search = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        search.set(key, value);
      }
    });

    const url = `${supabaseUrl}/rest/v1/${resource}${search.toString() ? `?${search}` : ""}`;
    const response = await fetch(url, {
      method,
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        ...(prefer ? { Prefer: prefer } : {}),
        ...headers
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      data = text;
    }

    if (!response.ok) {
      const message =
        (data && typeof data === "object" && (data.message || data.error_description || data.error)) ||
        text ||
        "Supabase request failed";
      throw new Error(message);
    }

    return data;
  }

  async function bootstrapIfEmpty() {
    const shipmentRows = await request("GET", "shipments", {
      query: { select: "tracking_number", limit: "1" }
    });

    if (!Array.isArray(shipmentRows) || !shipmentRows.length) {
      const shipments = readJsonArray(dataFile);
      if (shipments.length) {
        const shipmentBodies = shipments.map((shipment) => ({
          tracking_number: shipment.tracking_number,
          phone_number: normalizePhoneNumber(shipment.phone_number, defaultCountryCode),
          arabic_status: shipment.arabic_status,
          english_status: shipment.english_status,
          last_update_time: shipment.last_update_time,
          delivery_date: shipment.delivery_date,
          preferred_language: shipment.preferred_language === "en" ? "en" : "ar"
        }));

        await request("POST", "shipments", {
          body: shipmentBodies,
          prefer: "return=minimal"
        });

        const updateBodies = shipments.flatMap((shipment) =>
          (shipment.history || []).map((update) => ({
            id: crypto.randomUUID(),
            tracking_number: shipment.tracking_number,
            arabic_status: update.arabic_status || shipment.arabic_status,
            english_status: update.english_status || shipment.english_status,
            timestamp: update.timestamp || shipment.last_update_time,
            location: update.location || "",
            progress: Number.isFinite(Number(update.progress)) ? Number(update.progress) : 0
          }))
        );

        if (updateBodies.length) {
          await request("POST", "shipment_updates", {
            body: updateBodies,
            prefer: "return=minimal"
          });
        }
      }
    }

    const suggestionRows = await request("GET", "suggestions", {
      query: { select: "id", limit: "1" }
    });

    if (!Array.isArray(suggestionRows) || !suggestionRows.length) {
      const suggestions = readJsonArray(suggestionsFile);
      if (suggestions.length) {
        await request("POST", "suggestions", {
          body: suggestions.map((item) => ({
            id: item.id || crypto.randomUUID(),
            name: String(item.name || "").trim(),
            phone_number: normalizePhoneNumber(item.phone_number, defaultCountryCode),
            tracking_number: String(item.tracking_number || "").trim().toUpperCase(),
            message: String(item.message || "").trim(),
            language: item.language === "en" ? "en" : "ar",
            created_at: item.created_at || new Date().toISOString()
          })),
          prefer: "return=minimal"
        });
      }
    }
  }

  async function getUpdatesMap() {
    const updates = await request("GET", "shipment_updates", {
      query: {
        select: "tracking_number,arabic_status,english_status,timestamp,location,progress",
        order: "timestamp.asc"
      }
    });

    return updates.reduce((map, row) => {
      if (!map.has(row.tracking_number)) {
        map.set(row.tracking_number, []);
      }
      map.get(row.tracking_number).push({
        arabic_status: row.arabic_status,
        english_status: row.english_status,
        timestamp: row.timestamp,
        location: row.location || "",
        progress: Number(row.progress || 0)
      });
      return map;
    }, new Map());
  }

  async function getAllShipments() {
    await bootstrapIfEmpty();
    const [shipments, updatesMap] = await Promise.all([
      request("GET", "shipments", {
        query: {
          select:
            "tracking_number,phone_number,arabic_status,english_status,last_update_time,delivery_date,preferred_language",
          order: "last_update_time.desc"
        }
      }),
      getUpdatesMap()
    ]);

    return shipments.map((shipment) => ({
      ...shipment,
      preferred_language: shipment.preferred_language === "en" ? "en" : "ar",
      history: updatesMap.get(shipment.tracking_number) || []
    }));
  }

  async function getShipment(trackingNumber) {
    await bootstrapIfEmpty();
    const rows = await request("GET", "shipments", {
      query: {
        select:
          "tracking_number,phone_number,arabic_status,english_status,last_update_time,delivery_date,preferred_language",
        tracking_number: `eq.${trackingNumber}`,
        limit: "1"
      }
    });

    const shipment = rows[0];
    if (!shipment) {
      return null;
    }

    const updates = await request("GET", "shipment_updates", {
      query: {
        select: "arabic_status,english_status,timestamp,location,progress",
        tracking_number: `eq.${trackingNumber}`,
        order: "timestamp.asc"
      }
    });

    return {
      ...shipment,
      preferred_language: shipment.preferred_language === "en" ? "en" : "ar",
      history: updates.map((row) => ({
        arabic_status: row.arabic_status,
        english_status: row.english_status,
        timestamp: row.timestamp,
        location: row.location || "",
        progress: Number(row.progress || 0)
      }))
    };
  }

  async function createShipment(payload) {
    const timestamp = new Date().toISOString();
    const shipment = {
      tracking_number: payload.tracking_number.trim().toUpperCase(),
      phone_number: normalizePhoneNumber(payload.phone_number, defaultCountryCode),
      arabic_status: payload.arabic_status.trim(),
      english_status: payload.english_status.trim(),
      last_update_time: timestamp,
      delivery_date: payload.delivery_date,
      preferred_language: payload.preferred_language === "en" ? "en" : "ar"
    };

    await request("POST", "shipments", {
      body: shipment,
      prefer: "return=minimal"
    });

    await request("POST", "shipment_updates", {
      body: [
        {
          id: crypto.randomUUID(),
          tracking_number: shipment.tracking_number,
          arabic_status: "تم إنشاء الشحنة",
          english_status: "Shipment Created",
          timestamp,
          location: "Warehouse",
          progress: 10
        },
        {
          id: crypto.randomUUID(),
          tracking_number: shipment.tracking_number,
          arabic_status: shipment.arabic_status,
          english_status: shipment.english_status,
          timestamp,
          location: "",
          progress: 25
        }
      ],
      prefer: "return=minimal"
    });

    appendAuditLog("shipment.created", {
      tracking_number: shipment.tracking_number,
      phone_number: shipment.phone_number,
      preferred_language: shipment.preferred_language
    });

    return getShipment(shipment.tracking_number);
  }

  async function updateShipment(trackingNumber, payload) {
    const current = await getShipment(trackingNumber);
    if (!current) {
      return null;
    }

    const timestamp = new Date().toISOString();
    const nextShipment = {
      phone_number: payload.phone_number
        ? normalizePhoneNumber(payload.phone_number, defaultCountryCode)
        : current.phone_number,
      arabic_status: payload.arabic_status ? payload.arabic_status.trim() : current.arabic_status,
      english_status: payload.english_status ? payload.english_status.trim() : current.english_status,
      last_update_time: timestamp,
      delivery_date: payload.delivery_date || current.delivery_date,
      preferred_language: payload.preferred_language === "en" ? "en" : current.preferred_language
    };

    const progress = Number.isFinite(Number(payload.progress))
      ? Number(payload.progress)
      : Number(current.history[current.history.length - 1]?.progress || 0);

    await request("PATCH", "shipments", {
      query: { tracking_number: `eq.${trackingNumber}` },
      body: nextShipment,
      prefer: "return=minimal"
    });

    await request("POST", "shipment_updates", {
      body: {
        id: crypto.randomUUID(),
        tracking_number: trackingNumber,
        arabic_status: nextShipment.arabic_status,
        english_status: nextShipment.english_status,
        timestamp,
        location: payload.location || "",
        progress
      },
      prefer: "return=minimal"
    });

    appendAuditLog("shipment.updated", {
      tracking_number: trackingNumber,
      arabic_status: nextShipment.arabic_status,
      english_status: nextShipment.english_status,
      location: payload.location || "",
      progress
    });

    return getShipment(trackingNumber);
  }

  async function getAllSuggestions() {
    await bootstrapIfEmpty();
    return request("GET", "suggestions", {
      query: {
        select: "id,name,phone_number,tracking_number,message,language,created_at",
        order: "created_at.desc"
      }
    });
  }

  async function createSuggestion(payload) {
    const suggestion = {
      id: crypto.randomUUID(),
      name: String(payload.name || "").trim(),
      phone_number: normalizePhoneNumber(payload.phone_number, defaultCountryCode),
      tracking_number: String(payload.tracking_number || "").trim().toUpperCase(),
      message: String(payload.message || "").trim(),
      language: payload.language === "en" ? "en" : "ar",
      created_at: new Date().toISOString()
    };

    await request("POST", "suggestions", {
      body: suggestion,
      prefer: "return=minimal"
    });

    appendAuditLog("suggestion.created", {
      suggestion_id: suggestion.id,
      tracking_number: suggestion.tracking_number,
      language: suggestion.language
    });

    return suggestion;
  }

  return {
    getAllShipments,
    getShipment,
    createShipment,
    updateShipment,
    getAllSuggestions,
    createSuggestion
  };
}

module.exports = {
  createSupabaseDatabase
};
