import { Probot, Server } from "probot";
import { config } from "dotenv";

import { app } from "./app";

config();

const key = process.env.RENDER
  ? process.env.PRIVATE_KEY?.replace(/\\n/g, "\n")
  : process.env.PRIVATE_KEY;
const server = new Server({
  webhookProxy: process.env.WEBHOOK_PROXY_URL,
  Probot: Probot.defaults({
    appId: process.env.APP_ID,
    privateKey: key,
    secret: process.env.WEBHOOK_SECRET,
  }),
});
server.load(app).then(() => {
  server.start();
});
