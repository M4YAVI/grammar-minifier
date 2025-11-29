import serverless from "serverless-http";
import { app } from "../../server/app";
import { registerRoutes } from "../../server/routes";
import { createServer } from "http";

// Initialize routes
const httpServer = createServer(app);
registerRoutes(httpServer, app);

export const handler = serverless(app);
