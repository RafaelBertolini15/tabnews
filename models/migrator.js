import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

const defaultgetHandlerOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  getHandlerTable: "pggetHandler",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendinggetHandler = await migrationRunner({
      ...defaultgetHandlerOptions,
      dbClient,
    });
    return pendinggetHandler;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migretedgetMigrations = await migrationRunner({
      ...defaultgetHandlerOptions,
      dbClient,
      dryRun: false,
    });

    return migretedgetMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
