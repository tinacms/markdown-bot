// functions/index.js

import {
  createLambdaFunction,
  createProbot,
} from "@probot/adapter-aws-lambda-serverless";
import { app } from "../src/app";

module.exports.handler = createLambdaFunction(app, {
  probot: createProbot(),
});
