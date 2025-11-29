import { app } from "../server/app";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const httpServer = createServer(app);
let ready = false;

const start = async () => {
    if (ready) return;

    await registerRoutes(httpServer, app);

    ready = true;
};

export default async (req: any, res: any) => {
    await start();
    app(req, res);
};
