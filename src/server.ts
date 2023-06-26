import { Probot, Server } from "probot";
import { config } from "dotenv";

import { app } from "./app";

config();

const server = new Server({
  webhookProxy: process.env.WEBHOOK_PROXY_URL,
  Probot: Probot.defaults({
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    secret: process.env.WEBHOOK_SECRET,
  }),
});
server.load(app).then(() => {
  server.start();
});
