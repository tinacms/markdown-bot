# Content Suggestion BOT

> A content suggestion robot powered by ChatGPT

This bot will make github suggestion comments to update the contents of a file in a PR

When ever a user comments `ai fix: <filename>` or `ai fix: <file1>, <file2>` the bot will respond with a suggestion for the contents of the file.

## Example

![Example](http://res.cloudinary.com/forestry-demo/image/upload/v1688483462/blog-media/supercharge-markdown-blog/Screenshot_2023-07-04_at_11.03.24_AM_bfqnld.png)

## Usage

This bot can be used in two ways:

1. As a Github app (self-hosted)
2. As a Github action

A github app can be hosted on any hosting platform that supports node.js, it can be also be hosted in a serverless environment such as AWS Lambda or Netlify Functions.

> NOTE: Serverless functions sometime have timeout limitations or sometimes stop after a request responds with e 202 status code (This is the behavior in vercel). This may cause the bot to fail if the OpenAI API takes too long to respond.

A Github action is hosted by Github and will run on every comment to the repo, the action will only respond to comments on a PR and only if the comment follows the correct format.

The bot responds to a comment in the format `ai fix: <filename>` or `ai fix: <file1>, <file2>`. A prompt can also be added by adding a adding `prompt: <prompt>` after the filename to the to the comment.

For example:

```
ai fix: README.md
prompt: Fix only the spelling and grammar errors in the README
```

![Example](http://res.cloudinary.com/forestry-demo/image/upload/v1688736596/blog-media/supercharge-markdown-blog/Screenshot_2023-07-07_at_8.41.32_AM_xsoswd.png)

## Github app Usage

We do not provide a hosted version of the Github app so you will need to self-host it. You can self-host it on on most hosting platforms we have setup and tested it on netlify (Functions) and render.

### Self-hosting on Netlify

> NOTE: functions are limited to a 10 second timeout on Netlify. This may cause the bot to fail if the OpenAI API takes too long to respond.
> To avoid this a background function can be used instead of the normal function. Netlify background functions are only available on the paid tier.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tinacms/ai-content)

This will clone the repo to your github account and deploy it to Netlify. [See below](#env-variables) for the required env variables.

### Self-hosting on Render

> NOTE: when using the free tier you may get frequent 503 errors due to the app being put to sleep. To avoid this you can upgrade to the paid tier.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tinacms/ai-content)

## ENV Variables

Before deploying you will need to set the following environment variables:

```env
# The Github App ID
APP_ID=***

# The Client ID of the Github App
GITHUB_CLIENT_ID***

# The Client Secret of the Github App
GITHUB_CLIENT_SECRET=***

# The private key of the Github App (Copy and pasted from the .pem file)
PRIVATE_KEY=***

# The webhook secret of the Github App (User generated and pasted into the Github App)
WEBHOOK_SECRET=***
```

For more details, refer to the [probot](https://probot.github.io/docs/development/#manually-configuring-a-github-app) documentation.

## Github action Usage

When using as a Github action it will run on every comment to the repo, the bot will only respond to comments on a PR and only if the comment follows the format `ai fix: <filename>` or `ai fix: <file1>, <file2>`.

### Add the Github secret

1. Go to the repo homepage which you want integrate this bot
2. click settings
3. click actions under secrets and variables
4. Change to Secrets tab, create a new secrets OPENAI_API_KEY with the value of your open api key

### Add The Github Action to your repo

`.github/actions/content-suggestion.yml`

```yml
name: Content Suggestion

permissions:
  contents: read
  pull-requests: write

on:
  issue_comment:
    types: [created]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # TODO: change to tina repo
      - uses: logan-anderson/openai-content-suggestions@v0
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

### Configuration

1. Click on `Settings`.
2. Click on `Actions` under `Secrets and Variables`.
3. Change to the `Variables` tab and create a new variable `OPENAI_API_KEY` with the value of your OpenAI API key. (For GitHub Action integration, set it in secrets)
   ![Variable Configuration](./images/variable-configuration.png)

### Start Using

1. The bot will automatically suggest content when
2. After making changes to the issue or pull request, the content suggestion bot will provide updated suggestions.

## Contributing / Running Locally

If you want to run locally or if you have suggestions for how the content suggestion bot could be improved or want to report a bug, open an issue! We welcome all contributions.

For more information, please refer to the [Contributing Guide](CONTRIBUTING.md).

## Credit

This project is inspired by [ChatGPT-CodeReview](https://github.com/anc95/ChatGPT-CodeReview).

## Contributing

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2023 Logan Anderson
