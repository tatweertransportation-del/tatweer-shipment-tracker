const { createSqliteDatabase } = require("./sqlite-db");
const { createSupabaseDatabase } = require("./supabase-db");

function resolveStorageDriver() {
  const explicitDriver = String(process.env.STORAGE_DRIVER || "").trim().toLowerCase();
  if (explicitDriver) {
    return explicitDriver;
  }

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return "supabase";
  }

  return "sqlite";
}

function createDatabase(options) {
  const driver = resolveStorageDriver();

  if (driver === "supabase") {
    return createSupabaseDatabase(options);
  }

  return createSqliteDatabase(options);
}

module.exports = {
  createDatabase
};
