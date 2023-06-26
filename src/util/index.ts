import type { Context } from "probot";
import { Settings } from "../settings";

export const getOpenAIKey = async (context: Context) => {
  const settings = Settings.getInstance();
  if (settings.openaiKey) {
    return settings.openaiKey;
  }
  if (typeof process.env.OPENAI_API_KEY === "string") {
    return process.env.OPENAI_API_KEY;
  }

  const repo = context.repo();

  try {
    const { data } = await context.octokit.request(
      "GET /repos/{owner}/{repo}/actions/variables/{name}",
      {
        owner: repo.owner,
        repo: repo.repo,
        name: "OPENAI_API_KEY",
      }
    );

    if (!data?.value) {
      throw new Error("OPENAI_API_KEY not set");
    }

    return data.value as string;
  } catch (e) {
    console.log("error getting variables", e);
    await context.octokit.issues.createComment({
      repo: repo.repo,
      owner: repo.owner,
      issue_number: context.pullRequest().pull_number,
      body: `Seems you are using me but didn't get OPENAI_API_KEY seted in Variables/Secrets for this repo. you could follow [readme](https://github.com/anc95/ChatGPT-CodeReview) for more information`,
    });
    return null;
  }
};
