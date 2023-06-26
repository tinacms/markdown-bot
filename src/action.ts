// This is the entrypoint for the GitHub Action

import { run } from "@probot/adapter-github-actions";
import * as core from "@actions/core";
import { Settings } from "./settings";
import { app } from "./app";

const settings = Settings.getInstance();

settings.setDefaults({
  model: core.getInput("MODEL"),
  temperature: Number(core.getInput("TEMPERATURE")),
  githubToken: core.getInput("GITHUB_TOKEN"),
  openaiKey: core.getInput("OPENAI_API_KEY"),
  topP: Number(core.getInput("TOP_P")),
});

run(app).catch((error) => {
  console.error(error);
  process.exit(1);
});
