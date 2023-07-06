// api/github/webhooks/index.ts
// This is used for hosting the app on Vercel
import { createNodeMiddleware, createProbot } from "probot";

import { app } from "../../../src/app";

module.exports = createNodeMiddleware(app, {
  probot: createProbot(),
  webhooksPath: "/api/github/webhooks",
});
