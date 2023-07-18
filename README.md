# Content Suggestion BOT

> A content suggestion robot powered by ChatGPT

This bot will make GitHub suggestion comments to update the contents of a file in a PR

When a user comments `ai fix: <filename>` or `ai fix: <file1>, <file2>` the bot will respond with inline suggestions on the PR.

A prompt can also be added by adding `prompt: <prompt>` after the filename to the comment.

For example:

```
ai fix: content/blog/Supercharge-Your-Markdown-Blog-With-AI.md
prompt: only return a signle suggestion
```

![Example](http://res.cloudinary.com/forestry-demo/image/upload/v1688736596/blog-media/supercharge-markdown-blog/Screenshot_2023-07-07_at_8.41.32_AM_xsoswd.png)

## Table of Contents

- [Example](#example)
- [Usage](#usage)
- [Implementing as a GitHub App](#github-app-implementation)
  - [Create a GitHub App](#create-a-github-app)
  - [Hosting the App](#hosting-the-bot-backend)
    - [Self-hosting on Netlify](#self-hosting-on-netlify)
    - [Self-hosting on Render](#self-hosting-on-render)
  - [ENV Variables](#env-variables)
- [Implementing as a GitHub Action](#github-action-implementation)
  - [Add the GitHub Secret](#add-the-github-secret)
  - [Add the GitHub Action to your repo](#add-the-github-action-to-your-repo)
  - [Testing the GitHub Action](#testing-the-github-action)
- [Contributing / Running Locally](#contributing---running-locally)
- [Credit](#credit)
- [Contributing](#contributing)
- [License](#license)

## Implementation

This bot can be implemented in two ways:

1. As a GitHub App (self-hosted)
2. As a GitHub Action

A GitHub App can be hosted on any hosting platform that supports Node.js. It can also be hosted in a serverless environment such as AWS Lambda or Netlify Functions.

> NOTE: Serverless functions sometimes have timeout limitations or stop after a request responds with a 202 status code (This is the behavior in Vercel). This may cause the bot to fail if the OpenAI API takes too long to respond.

A GitHub Action is hosted by GitHub and will run on every comment to the repo, the action will only respond to comments on a PR and only if the comment follows the correct `ai fix` format.


## GitHub App Implementation

We do not provide a hosted version of the GitHub App so you will need to self-host it. You can self-host it on most hosting platforms. We have set up and tested it on Netlify (Functions) and Render.

### Create a GitHub App

> Follow the steps below or watch the video

[![Creating a GitHub App](https://i.ytimg.com/vi/efghs1J56i8/maxresdefault.jpg)](https://www.youtube.com/watch?v=efghs1J56i8 "Creating a GitHub App")

1. Go to your GitHub settings, [create a new GitHub App](https://github.com/settings/apps/new)
2. Fill in the details (can put in temp values for the URL and webhook URL. We can update these later)
3. Under permissions select `Read` for `Contents`. Select `Read & Write` for `Pull Requests` and `Issues`.
4. Under "Subscribe to Events" select `Issue comment`
5. Generate a [webhook secret](https://docs.github.com/en/webhooks-and-events/webhooks/securing-your-webhooks) and copy it into the `Webhook Secret` field and save it somewhere safe
6. Make sure "Only on this account" is selected under "Where can this GitHub App be installed?"
7. Click "Create GitHub App"
8. In the app settings click on "Generate a private key" and save the .pem file somewhere safe

### Hosting the Bot Backend

For the GitHub App implementation of this bot, you need to host the backend somewhere. This sets up an API that will be requested once a user on your repo comments on a line in your PRs.

#### Self-hosting on Netlify

> NOTE: functions are limited to a 10 second timeout on Netlify. This may cause the bot to fail if the OpenAI API takes too long to respond.
> To avoid this a background function can be used instead of the normal function. Netlify background functions are only available on the paid tier.

[![Self-hosting on Netlify](https://i.ytimg.com/vi/Y30bPJP7qK0/maxresdefault.jpg)](https://www.youtube.com/watch?v=Y30bPJP7qK0 "Self-hosting on Netlify")

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tinacms/ai-content)

This will clone the repo to your GitHub account and deploy it to Netlify. [See below](#env-variables) for the required env variables.

#### Self-hosting on Render

> NOTE: when using the free tier you may get frequent 503 errors due to the app being put to sleep. To avoid this you can upgrade to the paid tier.

[![Self-hosting on Render](https://i.ytimg.com/vi/CSmHkAvfziE/maxresdefault.jpg)](https://www.youtube.com/watch?v=CSmHkAvfziE "Self-hosting on Render")

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tinacms/ai-content)

### ENV Variables

When setting the bot backend on your hosting provider, you will need to set the following environment variables:

```env
# The GitHub App ID
APP_ID=***

# The Client ID of the GitHub App
GITHUB_CLIENT_ID=***

# The Client Secret of the GitHub App
GITHUB_CLIENT_SECRET=***

# The private key of the GitHub App (Copy and pasted from the .pem file)
PRIVATE_KEY=***

# The webhook secret of the GitHub App (User generated and pasted into the GitHub App)
# Can be generated by running: `ruby -rsecurerandom -e 'puts SecureRandom.hex(20)`
WEBHOOK_SECRET=***
```

See the [ProBot docs](https://probot.github.io/docs/configuration/) & [ProBot Configuration Guide](https://probot.github.io/docs/development/#manually-configuring-a-github-app) for more details.

## GitHub Action Implementation

When implementing this bot as a GitHub Action it will run on every comment to the repo, the bot will only respond to comments on a PR and only if the comment follows the format `ai fix: <filename>` or `ai fix: <file1>, <file2>`.

### Add the GitHub Secret

1. Go to the repo homepage in which you want to integrate this bot
2. Click "Settings"
3. Click "Actions" under "Secrets and Variables"
4. Change to the "Secrets" tab, create a new `OPENAI_API_KEY` secret with the value of your OpenAI API key

### Add The GitHub Action to your repo

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

### Testing The GitHub Action

The GitHub Action will run on any comment to a PR/issue, but it will only respond to comments on a PR if the comment follows the format `ai fix: <filename>` or `ai fix: <file1>, <file2>`.

To try it out: On a PR, comment `ai fix: <filename>`.

## Contributing / Running Locally

If you want to run locally or if you have suggestions for how the content suggestion bot could be improved or want to report a bug, open an issue! We welcome all contributions.

For more information, please refer to the [Contributing Guide](CONTRIBUTING.md).

## Credit

This project is inspired by [ChatGPT-CodeReview](https://github.com/anc95/ChatGPT-CodeReview).

## Contributing

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE)
