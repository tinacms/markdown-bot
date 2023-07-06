// functions/index.js
const {
  createLambdaFunction,
  createProbot,
} = require("@probot/adapter-aws-lambda-serverless");
const appFn = require("../src/app");

module.exports.handler = createLambdaFunction(appFn, {
  probot: createProbot(),
});
