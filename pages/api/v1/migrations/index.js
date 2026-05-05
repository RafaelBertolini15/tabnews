import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultgetHandlerOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  getHandlerTable: "pggetHandler",
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendinggetHandler = await migrationRunner({
      ...defaultgetHandlerOptions,
      dbClient,
    });
    response.status(200).json(pendinggetHandler);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migretedgetHandler = await migrationRunner({
      ...defaultgetHandlerOptions,
      dbClient,
      dryRun: false,
    });

    if (migretedgetHandler.length > 0) {
      response.status(201).json(migretedgetHandler);
    }

    response.status(200).json(migretedgetHandler);
  } finally {
    await dbClient.end();
  }
}
