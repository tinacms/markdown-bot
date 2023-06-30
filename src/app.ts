import { Probot } from "probot";
import { OpenAI } from "./openai";
import { getOpenAIKey } from "./util";
import { parseGithubComment } from "./util/parseGithubComment";
import { Settings } from "./settings";

export const app = (app: Probot) => {
  app.on(["issue_comment.created", "issue_comment.edited"], async (context) => {
    const settings = Settings.getInstance();
    if (!settings.defaultsSet) {
      settings.setDefaults({});
    }

    if (context.isBot) {
      console.log("Ignoring bot comment");
      return;
    }

    const issueComment = context.payload.comment.body;
    const issueNumber = context.payload.issue.number;
    const isPullrequest = context.payload.issue.pull_request;

    if (!isPullrequest) {
      console.log(
        `Issue ${issueNumber} is not a pull request. Ignoring comment`
      );
      return;
    }
    const files = parseGithubComment(issueComment);
    if (!files) {
      console.log(`No files found in comment "${issueComment}"`);
      return;
    }

    const openAIKey = await getOpenAIKey(context);
    if (!openAIKey) {
      console.log("No OpenAI key found");
      return;
    }

    const pull_request = await context.octokit.rest.pulls.get({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      pull_number: issueNumber,
    });

    const head = pull_request.data.head.sha;
    const base = pull_request.data.base.sha;

    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;

    const ai = new OpenAI({
      apiKey: openAIKey,
    });

    const makeSuggestionsAndPR = async ({
      content,
      patch,
      fileName,
    }: {
      content: string;
      patch: string;
      fileName: string;
    }) => {
      const res = await ai.makeSuggestions({ content, patch });
      if (res.error) {
        console.log("Error making suggestions");
        return;
      }
      const suggestions = res.suggestions;

      const comments = suggestions.map((suggestion) => ({
        body: `\`\`\`suggestion
      ${suggestion.suggestion}
      \`\`\``,
        path: fileName,
        line: suggestion.line,
      }));
      await context.octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: issueNumber,
        event: "COMMENT",
        body: `Suggestions from the AI for file ${fileName}`,
        comments,
      });
    };

    const data = await context.octokit.repos.compareCommits({
      owner,
      repo,
      base,
      head,
    });
    let { files: changedFiles } = data.data;

    if (!changedFiles) {
      console.log(
        `No changed files found in Pull request ${issueNumber}. Comparing ${base} to ${head}`
      );
      return;
    }

    for (let i = 0; i < changedFiles.length; i++) {
      const f = changedFiles[i];
      if (files.includes(f.filename)) {
        const file = await context.octokit.repos.getContent({
          owner,
          repo,
          path: f.filename,
          ref: head,
        });
        // @ts-ignore
        const content = Buffer.from(file.data.content, "base64").toString();
        const patch = f.patch;
        if (!patch) {
          console.log(
            `No patch found for file ${f.filename} in PR ${issueNumber}`
          );
          return;
        }
        try {
          await makeSuggestionsAndPR({ content, patch, fileName: f.filename });
        } catch (e) {
          context.octokit.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: `Error making suggestions: Please check the github action or Github bot logs for more info`,
          });
        }
      }
    }
  });
};
