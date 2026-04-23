const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

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

function createSqliteDatabase(options) {
  const {
    dbPath,
    dataFile,
    suggestionsFile,
    auditLogFile,
    defaultCountryCode = "20"
  } = options;

  ensureDir(path.dirname(dbPath));
  ensureDir(path.dirname(auditLogFile));

  if (!fs.existsSync(auditLogFile)) {
    fs.writeFileSync(auditLogFile, "", "utf8");
  }

  const db = new DatabaseSync(dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = FULL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS shipments (
      tracking_number TEXT PRIMARY KEY,
      phone_number TEXT NOT NULL,
      arabic_status TEXT NOT NULL,
      english_status TEXT NOT NULL,
      last_update_time TEXT NOT NULL,
      delivery_date TEXT NOT NULL,
      preferred_language TEXT NOT NULL DEFAULT 'ar',
      internal_notes TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS shipment_updates (
      id TEXT PRIMARY KEY,
      tracking_number TEXT NOT NULL,
      arabic_status TEXT NOT NULL,
      english_status TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      progress INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (tracking_number) REFERENCES shipments(tracking_number) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS suggestions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      phone_number TEXT NOT NULL DEFAULT '',
      tracking_number TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'ar',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shipment_files (
      id TEXT PRIMARY KEY,
      tracking_number TEXT NOT NULL,
      file_name TEXT NOT NULL,
      mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
      file_size INTEGER NOT NULL DEFAULT 0,
      content_base64 TEXT NOT NULL,
      uploaded_at TEXT NOT NULL,
      FOREIGN KEY (tracking_number) REFERENCES shipments(tracking_number) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS shipment_file_access (
      tracking_number TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      password_value TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL,
      FOREIGN KEY (tracking_number) REFERENCES shipments(tracking_number) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS shipment_ratings (
      id TEXT PRIMARY KEY,
      tracking_number TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'ar',
      created_at TEXT NOT NULL,
      FOREIGN KEY (tracking_number) REFERENCES shipments(tracking_number) ON DELETE CASCADE
    );
  `);

  const shipmentColumns = db.prepare("PRAGMA table_info(shipments)").all();
  if (!shipmentColumns.some((column) => column.name === "internal_notes")) {
    db.exec("ALTER TABLE shipments ADD COLUMN internal_notes TEXT NOT NULL DEFAULT ''");
  }

  const fileAccessColumns = db.prepare("PRAGMA table_info(shipment_file_access)").all();
  if (!fileAccessColumns.some((column) => column.name === "password_value")) {
    db.exec("ALTER TABLE shipment_file_access ADD COLUMN password_value TEXT NOT NULL DEFAULT ''");
  }

  const countShipments = db.prepare("SELECT COUNT(*) AS count FROM shipments");
  const countSuggestions = db.prepare("SELECT COUNT(*) AS count FROM suggestions");

  function runInTransaction(work) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const result = work();
      db.exec("COMMIT");
      return result;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  if (Number(countShipments.get().count || 0) === 0) {
    const shipments = readJsonArray(dataFile);
    if (shipments.length) {
      const insertShipment = db.prepare(`
        INSERT INTO shipments (
          tracking_number,
          phone_number,
          arabic_status,
          english_status,
          last_update_time,
          delivery_date,
          preferred_language,
          internal_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertUpdate = db.prepare(`
        INSERT INTO shipment_updates (
          id,
          tracking_number,
          arabic_status,
          english_status,
          timestamp,
          location,
          progress
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const migrateShipments = (rows) => runInTransaction(() => {
        rows.forEach((shipment) => {
          insertShipment.run(
            shipment.tracking_number,
            normalizePhoneNumber(shipment.phone_number, defaultCountryCode),
            shipment.arabic_status,
            shipment.english_status,
            shipment.last_update_time,
            shipment.delivery_date,
            shipment.preferred_language === "en" ? "en" : "ar",
            String(shipment.internal_notes || "").trim()
          );

          (shipment.history || []).forEach((update) => {
            insertUpdate.run(
              crypto.randomUUID(),
              shipment.tracking_number,
              update.arabic_status || shipment.arabic_status,
              update.english_status || shipment.english_status,
              update.timestamp || shipment.last_update_time,
              update.location || "",
              Number.isFinite(Number(update.progress)) ? Number(update.progress) : 0
            );
          });
        });
      });

      migrateShipments(shipments);
    }
  }

  if (Number(countSuggestions.get().count || 0) === 0) {
    const suggestions = readJsonArray(suggestionsFile);
    if (suggestions.length) {
      const insertSuggestion = db.prepare(`
        INSERT INTO suggestions (
          id,
          name,
          phone_number,
          tracking_number,
          message,
          language,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const migrateSuggestions = (rows) => runInTransaction(() => {
        rows.forEach((item) => {
          insertSuggestion.run(
            item.id || crypto.randomUUID(),
            String(item.name || "").trim(),
            normalizePhoneNumber(item.phone_number, defaultCountryCode),
            String(item.tracking_number || "").trim().toUpperCase(),
            String(item.message || "").trim(),
            item.language === "en" ? "en" : "ar",
            item.created_at || new Date().toISOString()
          );
        });
      });

      migrateSuggestions(suggestions);
    }
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

  const shipmentsQuery = db.prepare(`
    SELECT
      tracking_number,
      phone_number,
      arabic_status,
      english_status,
      last_update_time,
      delivery_date,
      preferred_language,
      internal_notes
    FROM shipments
    ORDER BY datetime(last_update_time) DESC, tracking_number DESC
  `);

  const shipmentQuery = db.prepare(`
    SELECT
      tracking_number,
      phone_number,
      arabic_status,
      english_status,
      last_update_time,
      delivery_date,
      preferred_language,
      internal_notes
    FROM shipments
    WHERE tracking_number = ?
  `);

  const updatesByShipmentQuery = db.prepare(`
    SELECT
      id,
      tracking_number,
      arabic_status,
      english_status,
      timestamp,
      location,
      progress
    FROM shipment_updates
    WHERE tracking_number = ?
    ORDER BY datetime(timestamp) ASC, rowid ASC
  `);

  function hydrateShipment(row) {
    if (!row) {
      return null;
    }

    const history = updatesByShipmentQuery.all(row.tracking_number).map((update) => ({
      arabic_status: update.arabic_status,
      english_status: update.english_status,
      timestamp: update.timestamp,
      location: update.location || "",
      progress: Number(update.progress || 0)
    }));

    return {
      tracking_number: row.tracking_number,
      phone_number: row.phone_number,
      arabic_status: row.arabic_status,
      english_status: row.english_status,
      last_update_time: row.last_update_time,
      delivery_date: row.delivery_date,
      preferred_language: row.preferred_language === "en" ? "en" : "ar",
      internal_notes: row.internal_notes || "",
      history
    };
  }

  const insertShipment = db.prepare(`
    INSERT INTO shipments (
      tracking_number,
      phone_number,
      arabic_status,
      english_status,
      last_update_time,
      delivery_date,
      preferred_language,
      internal_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertUpdate = db.prepare(`
    INSERT INTO shipment_updates (
      id,
      tracking_number,
      arabic_status,
      english_status,
      timestamp,
      location,
      progress
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const updateShipmentStatement = db.prepare(`
    UPDATE shipments
    SET
      phone_number = ?,
      arabic_status = ?,
      english_status = ?,
      last_update_time = ?,
      delivery_date = ?,
      preferred_language = ?,
      internal_notes = ?
    WHERE tracking_number = ?
  `);

  const insertSuggestion = db.prepare(`
    INSERT INTO suggestions (
      id,
      name,
      phone_number,
      tracking_number,
      message,
      language,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const deleteShipmentStatement = db.prepare("DELETE FROM shipments WHERE tracking_number = ?");
  const filesByShipmentQuery = db.prepare(`
    SELECT
      id,
      tracking_number,
      file_name,
      mime_type,
      file_size,
      uploaded_at
    FROM shipment_files
    WHERE tracking_number = ?
    ORDER BY datetime(uploaded_at) DESC, file_name ASC
  `);
  const fileByIdQuery = db.prepare(`
    SELECT
      id,
      tracking_number,
      file_name,
      mime_type,
      file_size,
      content_base64,
      uploaded_at
    FROM shipment_files
    WHERE tracking_number = ? AND id = ?
  `);
  const deleteShipmentFileById = db.prepare("DELETE FROM shipment_files WHERE tracking_number = ? AND id = ?");
  const fileAccessQuery = db.prepare(`
    SELECT tracking_number, password_hash, password_value, updated_at
    FROM shipment_file_access
    WHERE tracking_number = ?
  `);
  const upsertFileAccess = db.prepare(`
    INSERT INTO shipment_file_access (tracking_number, password_hash, password_value, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(tracking_number) DO UPDATE SET
      password_hash = excluded.password_hash,
      password_value = excluded.password_value,
      updated_at = excluded.updated_at
  `);
  const insertShipmentFile = db.prepare(`
    INSERT INTO shipment_files (
      id,
      tracking_number,
      file_name,
      mime_type,
      file_size,
      content_base64,
      uploaded_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const ratingsQuery = db.prepare(`
    SELECT id, tracking_number, rating, comment, language, created_at
    FROM shipment_ratings
    ORDER BY datetime(created_at) DESC, rowid DESC
  `);
  const insertRating = db.prepare(`
    INSERT INTO shipment_ratings (
      id,
      tracking_number,
      rating,
      comment,
      language,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  return {
    getAllShipments() {
      return shipmentsQuery.all().map(hydrateShipment);
    },

    getShipment(trackingNumber) {
      return hydrateShipment(shipmentQuery.get(trackingNumber));
    },

    createShipment(payload) {
      const timestamp = new Date().toISOString();
      const shipment = {
        tracking_number: payload.tracking_number.trim().toUpperCase(),
        phone_number: normalizePhoneNumber(payload.phone_number, defaultCountryCode),
        arabic_status: payload.arabic_status.trim(),
        english_status: payload.english_status.trim(),
        last_update_time: timestamp,
        delivery_date: payload.delivery_date,
        preferred_language: payload.preferred_language === "en" ? "en" : "ar",
        internal_notes: String(payload.internal_notes || "").trim()
      };

      const history = [
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
      ];

      runInTransaction(() => {
        insertShipment.run(
          shipment.tracking_number,
          shipment.phone_number,
          shipment.arabic_status,
          shipment.english_status,
          shipment.last_update_time,
          shipment.delivery_date,
          shipment.preferred_language,
          shipment.internal_notes
        );

        history.forEach((item) => {
          insertUpdate.run(
            item.id,
            item.tracking_number,
            item.arabic_status,
            item.english_status,
            item.timestamp,
            item.location,
            item.progress
          );
        });
      });
      appendAuditLog("shipment.created", {
        tracking_number: shipment.tracking_number,
        phone_number: shipment.phone_number,
        preferred_language: shipment.preferred_language
      });
      return this.getShipment(shipment.tracking_number);
    },

    updateShipment(trackingNumber, payload) {
      const current = this.getShipment(trackingNumber);
      if (!current) {
        return null;
      }

      const timestamp = new Date().toISOString();
      const nextShipment = {
        tracking_number: current.tracking_number,
        phone_number: payload.phone_number
          ? normalizePhoneNumber(payload.phone_number, defaultCountryCode)
          : current.phone_number,
        arabic_status: payload.arabic_status ? payload.arabic_status.trim() : current.arabic_status,
        english_status: payload.english_status ? payload.english_status.trim() : current.english_status,
        last_update_time: timestamp,
        delivery_date: payload.delivery_date || current.delivery_date,
        preferred_language: payload.preferred_language === "en" ? "en" : current.preferred_language,
        internal_notes:
          payload.internal_notes !== undefined
            ? String(payload.internal_notes || "").trim()
            : current.internal_notes
      };

      const progress = Number.isFinite(Number(payload.progress))
        ? Number(payload.progress)
        : Number(current.history[current.history.length - 1]?.progress || 0);

      runInTransaction(() => {
        updateShipmentStatement.run(
          nextShipment.phone_number,
          nextShipment.arabic_status,
          nextShipment.english_status,
          nextShipment.last_update_time,
          nextShipment.delivery_date,
          nextShipment.preferred_language,
          nextShipment.internal_notes,
          nextShipment.tracking_number
        );

        insertUpdate.run(
          crypto.randomUUID(),
          nextShipment.tracking_number,
          nextShipment.arabic_status,
          nextShipment.english_status,
          timestamp,
          payload.location || "",
          progress
        );
      });
      appendAuditLog("shipment.updated", {
        tracking_number: nextShipment.tracking_number,
        arabic_status: nextShipment.arabic_status,
        english_status: nextShipment.english_status,
        location: payload.location || "",
        progress
      });
      return this.getShipment(nextShipment.tracking_number);
    },

    deleteShipment(trackingNumber) {
      const current = this.getShipment(trackingNumber);
      if (!current) {
        return false;
      }

      deleteShipmentStatement.run(trackingNumber);
      appendAuditLog("shipment.deleted", {
        tracking_number: trackingNumber
      });
      return true;
    },

    getAllSuggestions() {
      return db
        .prepare(`
          SELECT
            id,
            name,
            phone_number,
            tracking_number,
            message,
            language,
            created_at
          FROM suggestions
          ORDER BY datetime(created_at) DESC, rowid DESC
        `)
        .all();
    },

    createSuggestion(payload) {
      const suggestion = {
        id: crypto.randomUUID(),
        name: String(payload.name || "").trim(),
        phone_number: normalizePhoneNumber(payload.phone_number, defaultCountryCode),
        tracking_number: String(payload.tracking_number || "").trim().toUpperCase(),
        message: String(payload.message || "").trim(),
        language: payload.language === "en" ? "en" : "ar",
        created_at: new Date().toISOString()
      };

      insertSuggestion.run(
        suggestion.id,
        suggestion.name,
        suggestion.phone_number,
        suggestion.tracking_number,
        suggestion.message,
        suggestion.language,
        suggestion.created_at
      );

      appendAuditLog("suggestion.created", {
        suggestion_id: suggestion.id,
        tracking_number: suggestion.tracking_number,
        language: suggestion.language
      });

      return suggestion;
    },

    getShipmentFiles(trackingNumber) {
      return filesByShipmentQuery.all(trackingNumber);
    },

    getShipmentFile(trackingNumber, fileId) {
      return fileByIdQuery.get(trackingNumber, fileId) || null;
    },

    getShipmentFileAccess(trackingNumber) {
      return fileAccessQuery.get(trackingNumber) || null;
    },

    replaceShipmentFiles(trackingNumber, files, passwordHash, passwordValue = "") {
      const current = this.getShipment(trackingNumber);
      if (!current) {
        return null;
      }

      const uploadedAt = new Date().toISOString();
      const cleanFiles = files.map((file) => ({
        id: crypto.randomUUID(),
        tracking_number: trackingNumber,
        file_name: String(file.file_name || "shipment-file").trim(),
        mime_type: String(file.mime_type || "application/octet-stream").trim(),
        file_size: Number(file.file_size || 0),
        content_base64: String(file.content_base64 || "").trim(),
        uploaded_at: uploadedAt
      }));

      runInTransaction(() => {
        if (passwordHash) {
          upsertFileAccess.run(trackingNumber, passwordHash, String(passwordValue || ""), uploadedAt);
        }
        cleanFiles.forEach((file) => {
          insertShipmentFile.run(
            file.id,
            file.tracking_number,
            file.file_name,
            file.mime_type,
            file.file_size,
            file.content_base64,
            file.uploaded_at
          );
        });
      });

      appendAuditLog("shipment.files.added", {
        tracking_number: trackingNumber,
        files_count: cleanFiles.length
      });

      return this.getShipmentFiles(trackingNumber);
    },

    deleteShipmentFile(trackingNumber, fileId) {
      const current = this.getShipment(trackingNumber);
      if (!current) {
        return null;
      }

      const file = this.getShipmentFile(trackingNumber, fileId);
      if (!file) {
        return false;
      }

      deleteShipmentFileById.run(trackingNumber, fileId);
      appendAuditLog("shipment.file.deleted", {
        tracking_number: trackingNumber,
        file_id: fileId,
        file_name: file.file_name
      });

      return this.getShipmentFiles(trackingNumber);
    },

    getAllRatings() {
      return ratingsQuery.all();
    },

    createRating(payload) {
      const trackingNumber = String(payload.tracking_number || "").trim().toUpperCase();
      const current = this.getShipment(trackingNumber);
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

      insertRating.run(
        rating.id,
        rating.tracking_number,
        rating.rating,
        rating.comment,
        rating.language,
        rating.created_at
      );

      appendAuditLog("shipment.rating.created", {
        tracking_number: rating.tracking_number,
        rating: rating.rating
      });

      return rating;
    }
  };
}

module.exports = {
  createSqliteDatabase
};
