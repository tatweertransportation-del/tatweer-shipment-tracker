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

function hashDocumentsPassword(trackingNumber, password) {
  return crypto
    .createHash("sha256")
    .update(`${String(trackingNumber || "").toUpperCase()}::${String(password || "")}`)
    .digest("hex");
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
  let supportsInternalNotes = true;
  let supportsCustomerName = true;

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
      if (
        String(message).includes("schema cache") &&
        (String(message).includes("shipment_files") ||
          String(message).includes("shipment_file_access") ||
          String(message).includes("shipment_ratings"))
      ) {
        throw new Error(
          "Shipment extra tables are missing in Supabase. Run the latest Supabase migration SQL files in Supabase SQL Editor, then try again."
        );
      }
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
          customer_name: String(shipment.customer_name || "").trim(),
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
        select: "id,tracking_number,arabic_status,english_status,timestamp,location,progress",
        order: "timestamp.asc"
      }
    });

    return updates.reduce((map, row) => {
      if (!map.has(row.tracking_number)) {
        map.set(row.tracking_number, []);
      }
      map.get(row.tracking_number).push({
        id: row.id,
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
    const shipmentSelect =
      "tracking_number,phone_number,arabic_status,english_status,last_update_time,delivery_date,preferred_language" +
      (supportsInternalNotes ? ",internal_notes" : "") +
      (supportsCustomerName ? ",customer_name" : "");
    const [shipments, updatesMap] = await Promise.all([
      request("GET", "shipments", {
        query: {
          select: shipmentSelect,
          order: "last_update_time.desc"
        }
      }).catch((error) => {
        if (supportsInternalNotes && String(error.message || "").includes("internal_notes")) {
          supportsInternalNotes = false;
          return request("GET", "shipments", {
            query: {
              select:
                "tracking_number,phone_number,arabic_status,english_status,last_update_time,delivery_date,preferred_language" +
                (supportsCustomerName ? ",customer_name" : ""),
              order: "last_update_time.desc"
            }
          });
        }
        if (supportsCustomerName && String(error.message || "").includes("customer_name")) {
          supportsCustomerName = false;
          return request("GET", "shipments", {
            query: {
              select:
                "tracking_number,phone_number,arabic_status,english_status,last_update_time,delivery_date,preferred_language" +
                (supportsInternalNotes ? ",internal_notes" : ""),
              order: "last_update_time.desc"
            }
          });
        }
        throw error;
      }),
      getUpdatesMap()
    ]);

    return shipments.map((shipment) => ({
      ...shipment,
      customer_name: shipment.customer_name || "",
      internal_notes: shipment.internal_notes || "",
      preferred_language: shipment.preferred_language === "en" ? "en" : "ar",
      history: updatesMap.get(shipment.tracking_number) || []
    }));
  }

  async function getShipment(trackingNumber) {
    await bootstrapIfEmpty();
    const shipmentSelect =
      "tracking_number,phone_number,arabic_status,english_status,last_update_time,delivery_date,preferred_language" +
      (supportsInternalNotes ? ",internal_notes" : "") +
      (supportsCustomerName ? ",customer_name" : "");
    const rows = await request("GET", "shipments", {
      query: {
        select: shipmentSelect,
        tracking_number: `eq.${trackingNumber}`,
        limit: "1"
      }
    }).catch((error) => {
      if (supportsInternalNotes && String(error.message || "").includes("internal_notes")) {
        supportsInternalNotes = false;
        return request("GET", "shipments", {
          query: {
            select:
              "tracking_number,phone_number,arabic_status,english_status,last_update_time,delivery_date,preferred_language" +
              (supportsCustomerName ? ",customer_name" : ""),
            tracking_number: `eq.${trackingNumber}`,
            limit: "1"
          }
        });
      }
      if (supportsCustomerName && String(error.message || "").includes("customer_name")) {
        supportsCustomerName = false;
        return request("GET", "shipments", {
          query: {
            select:
              "tracking_number,phone_number,arabic_status,english_status,last_update_time,delivery_date,preferred_language" +
              (supportsInternalNotes ? ",internal_notes" : ""),
            tracking_number: `eq.${trackingNumber}`,
            limit: "1"
          }
        });
      }
      throw error;
    });

    const shipment = rows[0];
    if (!shipment) {
      return null;
    }

    const updates = await request("GET", "shipment_updates", {
      query: {
        select: "id,arabic_status,english_status,timestamp,location,progress",
        tracking_number: `eq.${trackingNumber}`,
        order: "timestamp.asc"
      }
    });

    return {
      ...shipment,
      customer_name: shipment.customer_name || "",
      internal_notes: shipment.internal_notes || "",
      preferred_language: shipment.preferred_language === "en" ? "en" : "ar",
      history: updates.map((row) => ({
        id: row.id,
        arabic_status: row.arabic_status,
        english_status: row.english_status,
        timestamp: row.timestamp,
        location: row.location || "",
        progress: Number(row.progress || 0)
      }))
    };
  }

  async function createShipment(payload) {
    const timestamp = payload.update_timestamp || new Date().toISOString();
    const shipment = {
      tracking_number: payload.tracking_number.trim().toUpperCase(),
      customer_name: String(payload.customer_name || "").trim(),
      phone_number: normalizePhoneNumber(payload.phone_number, defaultCountryCode),
      arabic_status: payload.arabic_status.trim(),
      english_status: payload.english_status.trim(),
      last_update_time: timestamp,
      delivery_date: payload.delivery_date,
      preferred_language: payload.preferred_language === "en" ? "en" : "ar"
    };
    const initialProgress = Math.max(
      0,
      Math.min(100, Number.isFinite(Number(payload.progress)) ? Number(payload.progress) : 25)
    );

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
          progress: Math.min(10, initialProgress)
        },
        {
          id: crypto.randomUUID(),
          tracking_number: shipment.tracking_number,
          arabic_status: shipment.arabic_status,
          english_status: shipment.english_status,
          timestamp,
          location: String(payload.location || "").trim(),
          progress: initialProgress
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

    const timestamp = payload.update_timestamp || new Date().toISOString();
    const nextArabicStatus = payload.arabic_status ? payload.arabic_status.trim() : current.arabic_status;
    const nextEnglishStatus = payload.english_status ? payload.english_status.trim() : current.english_status;
    const progress = Number.isFinite(Number(payload.progress))
      ? Number(payload.progress)
      : Number(current.history[current.history.length - 1]?.progress || 0);
    const newUpdate = {
      id: crypto.randomUUID(),
      tracking_number: trackingNumber,
      arabic_status: nextArabicStatus,
      english_status: nextEnglishStatus,
      timestamp,
      location: payload.location || "",
      progress
    };
    const latestUpdate = current.history
      .concat(newUpdate)
      .slice()
      .sort((first, second) => new Date(first.timestamp).getTime() - new Date(second.timestamp).getTime())
      .at(-1);
    const nextShipment = {
      phone_number: payload.phone_number
        ? normalizePhoneNumber(payload.phone_number, defaultCountryCode)
        : current.phone_number,
      ...(supportsCustomerName && payload.customer_name !== undefined
        ? { customer_name: String(payload.customer_name || "").trim() }
        : {}),
      arabic_status: latestUpdate?.arabic_status || nextArabicStatus,
      english_status: latestUpdate?.english_status || nextEnglishStatus,
      last_update_time: latestUpdate?.timestamp || timestamp,
      delivery_date: payload.delivery_date || current.delivery_date,
      preferred_language: payload.preferred_language === "en" ? "en" : current.preferred_language,
      ...(supportsInternalNotes && payload.internal_notes !== undefined
        ? { internal_notes: String(payload.internal_notes || "").trim() }
        : {})
    };

    await request("PATCH", "shipments", {
      query: { tracking_number: `eq.${trackingNumber}` },
      body: nextShipment,
      prefer: "return=minimal"
    });

    await request("POST", "shipment_updates", {
      body: newUpdate,
      prefer: "return=minimal"
    });

    appendAuditLog("shipment.updated", {
      tracking_number: trackingNumber,
      arabic_status: newUpdate.arabic_status,
      english_status: newUpdate.english_status,
      location: newUpdate.location,
      progress
    });

    return getShipment(trackingNumber);
  }

  async function updateShipmentDetails(trackingNumber, payload) {
    const current = await getShipment(trackingNumber);
    if (!current) {
      return null;
    }

    const nextTrackingNumber = String(payload.tracking_number || current.tracking_number).trim().toUpperCase();
    const latestUpdate = current.history[current.history.length - 1] || null;
    const currentFileAccess = await getShipmentFileAccess(current.tracking_number);
    const nextTimestamp = payload.update_timestamp || current.last_update_time || new Date().toISOString();
    const nextShipment = {
      tracking_number: nextTrackingNumber,
      ...(supportsCustomerName
        ? { customer_name: payload.customer_name !== undefined ? String(payload.customer_name || "").trim() : current.customer_name || "" }
        : {}),
      phone_number: payload.phone_number
        ? normalizePhoneNumber(payload.phone_number, defaultCountryCode)
        : current.phone_number,
      arabic_status: payload.arabic_status ? payload.arabic_status.trim() : current.arabic_status,
      english_status: payload.english_status ? payload.english_status.trim() : current.english_status,
      last_update_time: nextTimestamp,
      delivery_date: payload.delivery_date || current.delivery_date,
      preferred_language: payload.preferred_language === "en" ? "en" : current.preferred_language,
      ...(supportsInternalNotes
        ? { internal_notes: payload.internal_notes !== undefined ? String(payload.internal_notes || "").trim() : current.internal_notes || "" }
        : {})
    };

    if (nextTrackingNumber !== current.tracking_number) {
      await request("POST", "shipments", {
        body: nextShipment,
        prefer: "return=minimal"
      });

      for (const table of ["shipment_updates", "shipment_files", "shipment_ratings", "suggestions"]) {
        await request("PATCH", table, {
          query: { tracking_number: `eq.${current.tracking_number}` },
          body: { tracking_number: nextTrackingNumber },
          prefer: "return=minimal"
        });
      }

      if (currentFileAccess) {
        await request("PATCH", "shipment_file_access", {
          query: { tracking_number: `eq.${current.tracking_number}` },
          body: {
            tracking_number: nextTrackingNumber,
            password_hash: hashDocumentsPassword(nextTrackingNumber, currentFileAccess.password_value || ""),
            updated_at: nextTimestamp
          },
          prefer: "return=minimal"
        });
      }

      await request("DELETE", "shipments", {
        query: { tracking_number: `eq.${current.tracking_number}` },
        prefer: "return=minimal"
      });
    } else {
      await request("PATCH", "shipments", {
        query: { tracking_number: `eq.${trackingNumber}` },
        body: nextShipment,
        prefer: "return=minimal"
      });
    }

    if (latestUpdate) {
      await request("PATCH", "shipment_updates", {
        query: {
          tracking_number: `eq.${nextTrackingNumber}`,
          id: `eq.${latestUpdate.id}`
        },
        body: {
          arabic_status: nextShipment.arabic_status,
          english_status: nextShipment.english_status,
          timestamp: nextShipment.last_update_time,
          location: payload.location !== undefined ? String(payload.location || "").trim() : latestUpdate.location || "",
          progress: Number.isFinite(Number(payload.progress)) ? Number(payload.progress) : Number(latestUpdate.progress || 0)
        },
        prefer: "return=minimal"
      });
    }

    appendAuditLog("shipment.details_edited", {
      tracking_number: current.tracking_number,
      next_tracking_number: nextTrackingNumber
    });

    return getShipment(nextTrackingNumber);
  }

  async function updateShipmentUpdate(trackingNumber, updateId, payload) {
    const current = await getShipment(trackingNumber);
    if (!current) {
      return null;
    }

    const targetUpdate = current.history.find((item) => item.id === updateId);
    if (!targetUpdate) {
      return null;
    }

    const nextUpdate = {
      arabic_status: payload.arabic_status ? payload.arabic_status.trim() : targetUpdate.arabic_status,
      english_status: payload.english_status ? payload.english_status.trim() : targetUpdate.english_status,
      timestamp: payload.update_timestamp || targetUpdate.timestamp,
      location: payload.location !== undefined ? payload.location : targetUpdate.location,
      progress: Number.isFinite(Number(payload.progress)) ? Number(payload.progress) : Number(targetUpdate.progress || 0)
    };

    await request("PATCH", "shipment_updates", {
      query: {
        tracking_number: `eq.${trackingNumber}`,
        id: `eq.${updateId}`
      },
      body: nextUpdate,
      prefer: "return=minimal"
    });

    const refreshed = await getShipment(trackingNumber);
    const latestUpdate = refreshed?.history?.[refreshed.history.length - 1];
    if (!refreshed || !latestUpdate) {
      return refreshed;
    }

    await request("PATCH", "shipments", {
      query: { tracking_number: `eq.${trackingNumber}` },
      body: {
        arabic_status: latestUpdate.arabic_status,
        english_status: latestUpdate.english_status,
        last_update_time: latestUpdate.timestamp,
        preferred_language: payload.preferred_language === "en" ? "en" : current.preferred_language,
        ...(supportsInternalNotes && payload.internal_notes !== undefined
          ? { internal_notes: String(payload.internal_notes || "").trim() }
          : {})
      },
      prefer: "return=minimal"
    });

    appendAuditLog("shipment.update_edited", {
      tracking_number: trackingNumber,
      update_id: updateId,
      arabic_status: nextUpdate.arabic_status,
      english_status: nextUpdate.english_status,
      location: nextUpdate.location,
      progress: nextUpdate.progress
    });

    return getShipment(trackingNumber);
  }

  async function deleteShipment(trackingNumber) {
    const current = await getShipment(trackingNumber);
    if (!current) {
      return false;
    }

    await request("DELETE", "shipments", {
      query: { tracking_number: `eq.${trackingNumber}` },
      prefer: "return=minimal"
    });

    appendAuditLog("shipment.deleted", {
      tracking_number: trackingNumber
    });

    return true;
  }

  async function deleteShipmentUpdate(trackingNumber, updateId) {
    const current = await getShipment(trackingNumber);
    if (!current) {
      return null;
    }

    const targetUpdate = current.history.find((item) => item.id === updateId);
    if (!targetUpdate || current.history.length <= 1) {
      return null;
    }

    await request("DELETE", "shipment_updates", {
      query: {
        tracking_number: `eq.${trackingNumber}`,
        id: `eq.${updateId}`
      },
      prefer: "return=minimal"
    });

    const refreshed = await getShipment(trackingNumber);
    const latestUpdate = refreshed?.history?.[refreshed.history.length - 1];
    if (!refreshed || !latestUpdate) {
      return refreshed;
    }

    await request("PATCH", "shipments", {
      query: { tracking_number: `eq.${trackingNumber}` },
      body: {
        arabic_status: latestUpdate.arabic_status,
        english_status: latestUpdate.english_status,
        last_update_time: latestUpdate.timestamp
      },
      prefer: "return=minimal"
    });

    appendAuditLog("shipment.update_deleted", {
      tracking_number: trackingNumber,
      update_id: updateId
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

  async function getShipmentFiles(trackingNumber) {
    return request("GET", "shipment_files", {
      query: {
        select: "id,tracking_number,file_name,mime_type,file_size,uploaded_at",
        tracking_number: `eq.${trackingNumber}`,
        order: "uploaded_at.desc"
      }
    });
  }

  async function getShipmentFile(trackingNumber, fileId) {
    const rows = await request("GET", "shipment_files", {
      query: {
        select: "id,tracking_number,file_name,mime_type,file_size,content_base64,uploaded_at",
        tracking_number: `eq.${trackingNumber}`,
        id: `eq.${fileId}`,
        limit: "1"
      }
    });

    return rows[0] || null;
  }

  async function getShipmentFileAccess(trackingNumber) {
    const rows = await request("GET", "shipment_file_access", {
      query: {
        select: "*",
        tracking_number: `eq.${trackingNumber}`,
        limit: "1"
      }
    });

    return rows[0] || null;
  }

  async function getBackup() {
    const shipments = await getAllShipments();
    const [suggestions, ratings, shipmentFiles, fileAccess] = await Promise.all([
      getAllSuggestions(),
      getAllRatings(),
      request("GET", "shipment_files", {
        query: { select: "id,tracking_number,file_name,mime_type,file_size,content_base64,uploaded_at" }
      }),
      request("GET", "shipment_file_access", { query: { select: "*" } })
    ]);
    return {
      version: 1,
      exported_at: new Date().toISOString(),
      shipments,
      suggestions,
      ratings,
      shipment_files: shipmentFiles,
      shipment_file_access: fileAccess
    };
  }

  async function restoreBackup(backup) {
    const shipments = Array.isArray(backup.shipments) ? backup.shipments : [];
    const suggestions = Array.isArray(backup.suggestions) ? backup.suggestions : [];
    const ratings = Array.isArray(backup.ratings) ? backup.ratings : [];
    const shipmentFiles = Array.isArray(backup.shipment_files) ? backup.shipment_files : [];
    const fileAccess = Array.isArray(backup.shipment_file_access) ? backup.shipment_file_access : [];

    for (const table of ["shipment_ratings", "suggestions", "shipment_files", "shipment_file_access", "shipment_updates", "shipments"]) {
      await request("DELETE", table, {
        query: { id: table === "shipments" || table === "shipment_file_access" ? undefined : "not.is.null", tracking_number: table === "shipments" || table === "shipment_file_access" ? "not.is.null" : undefined },
        prefer: "return=minimal"
      });
    }

    if (shipments.length) {
      await request("POST", "shipments", {
        body: shipments.map((shipment) => ({
          tracking_number: shipment.tracking_number,
          customer_name: String(shipment.customer_name || ""),
          phone_number: normalizePhoneNumber(shipment.phone_number, defaultCountryCode),
          arabic_status: String(shipment.arabic_status || ""),
          english_status: String(shipment.english_status || ""),
          last_update_time: shipment.last_update_time || new Date().toISOString(),
          delivery_date: shipment.delivery_date || "",
          preferred_language: shipment.preferred_language === "en" ? "en" : "ar",
          internal_notes: String(shipment.internal_notes || "")
        })),
        prefer: "return=minimal"
      });
      const updates = shipments.flatMap((shipment) =>
        (shipment.history || []).map((update) => ({
          id: update.id || crypto.randomUUID(),
          tracking_number: shipment.tracking_number,
          arabic_status: String(update.arabic_status || shipment.arabic_status || ""),
          english_status: String(update.english_status || shipment.english_status || ""),
          timestamp: update.timestamp || shipment.last_update_time || new Date().toISOString(),
          location: String(update.location || ""),
          progress: Number.isFinite(Number(update.progress)) ? Number(update.progress) : 0
        }))
      );
      if (updates.length) {
        await request("POST", "shipment_updates", { body: updates, prefer: "return=minimal" });
      }
    }
    if (suggestions.length) await request("POST", "suggestions", { body: suggestions, prefer: "return=minimal" });
    if (ratings.length) await request("POST", "shipment_ratings", { body: ratings, prefer: "return=minimal" });
    if (fileAccess.length) await request("POST", "shipment_file_access", { body: fileAccess, prefer: "return=minimal" });
    if (shipmentFiles.length) await request("POST", "shipment_files", { body: shipmentFiles, prefer: "return=minimal" });

    appendAuditLog("backup.restored", { shipments_count: shipments.length });
    return getBackup();
  }

  async function replaceShipmentFiles(trackingNumber, files, passwordHash, passwordValue = "") {
    const current = await getShipment(trackingNumber);
    if (!current) {
      return null;
    }

    const uploadedAt = new Date().toISOString();

    if (passwordHash) {
      await request("POST", "shipment_file_access", {
        body: {
          tracking_number: trackingNumber,
          password_hash: passwordHash,
          password_value: String(passwordValue || ""),
          updated_at: uploadedAt
        },
        prefer: "resolution=merge-duplicates,return=minimal"
      });
    }

    if (files.length) {
      await request("POST", "shipment_files", {
        body: files.map((file) => ({
          id: crypto.randomUUID(),
          tracking_number: trackingNumber,
          file_name: String(file.file_name || "shipment-file").trim(),
          mime_type: String(file.mime_type || "application/octet-stream").trim(),
          file_size: Number(file.file_size || 0),
          content_base64: String(file.content_base64 || "").trim(),
          uploaded_at: uploadedAt
        })),
        prefer: "return=minimal"
      });
    }

    appendAuditLog("shipment.files.added", {
      tracking_number: trackingNumber,
      files_count: files.length
    });

    return getShipmentFiles(trackingNumber);
  }

  async function deleteShipmentFile(trackingNumber, fileId) {
    const current = await getShipment(trackingNumber);
    if (!current) {
      return null;
    }

    const file = await getShipmentFile(trackingNumber, fileId);
    if (!file) {
      return false;
    }

    await request("DELETE", "shipment_files", {
      query: {
        tracking_number: `eq.${trackingNumber}`,
        id: `eq.${fileId}`
      },
      prefer: "return=minimal"
    });

    appendAuditLog("shipment.file.deleted", {
      tracking_number: trackingNumber,
      file_id: fileId,
      file_name: file.file_name
    });

    return getShipmentFiles(trackingNumber);
  }

  async function getAllRatings() {
    return request("GET", "shipment_ratings", {
      query: {
        select: "id,tracking_number,rating,comment,language,created_at",
        order: "created_at.desc"
      }
    });
  }

  async function createRating(payload) {
    const trackingNumber = String(payload.tracking_number || "").trim().toUpperCase();
    const current = await getShipment(trackingNumber);
    if (!current) {
      return null;
    }

    const rating = {
      id: crypto.randomUUID(),
      tracking_number: trackingNumber,
      rating: Math.max(1, Math.min(5, Number(payload.rating || 0))),
      comment: String(payload.comment || "").trim(),
      language: payload.language === "en" ? "en" : "ar",
      created_at: new Date().toISOString()
    };

    await request("POST", "shipment_ratings", {
      body: rating,
      prefer: "return=minimal"
    });

    appendAuditLog("shipment.rating.created", {
      tracking_number: rating.tracking_number,
      rating: rating.rating
    });

    return rating;
  }

  return {
    getAllShipments,
    getShipment,
    getBackup,
    restoreBackup,
    createShipment,
    updateShipment,
    updateShipmentDetails,
    updateShipmentUpdate,
    deleteShipmentUpdate,
    deleteShipment,
    getAllSuggestions,
    createSuggestion,
    getShipmentFiles,
    getShipmentFile,
    getShipmentFileAccess,
    replaceShipmentFiles,
    deleteShipmentFile,
    getAllRatings,
    createRating
  };
}

module.exports = {
  createSupabaseDatabase
};
