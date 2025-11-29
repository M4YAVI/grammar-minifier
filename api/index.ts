import { app } from "../server/app";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/static";
import { createServer } from "http";

const httpServer = createServer(app);
let ready = false;

const start = async () => {
    if (ready) return;

    await registerRoutes(httpServer, app);

    // In Vercel, we want to serve static files if they aren't handled by API routes
    // serveStatic adds a catch-all route "*" to serve index.html
    serveStatic(app);

    ready = true;
};

export default async (req: any, res: any) => {
    await start();
    app(req, res);
};
