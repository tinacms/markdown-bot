# Content Suggestion BOT

> A content suggestion robot powered by ChatGPT

This bot will make github suggestion comments to update the contents of a file in a PR

When ever a user comments `ai fix: <filename>` or `ai fix: <file1>, <file2>` the bot will respond with a suggestion for the contents of the file.

## Example

![Example](http://res.cloudinary.com/forestry-demo/image/upload/v1688483462/blog-media/supercharge-markdown-blog/Screenshot_2023-07-04_at_11.03.24_AM_bfqnld.png)

## Usage

This bot can be used in three ways:

1. As a Github app
2. As a Github action
3. As a Github app (self-hosted)

The easiest way to get started is to use the hosted Github app but do to so you will need to expose your openai api key as a [github variable](https://docs.github.com/en/actions/learn-github-actions/variables). While variables are not encrypted they are only exposed accessible to Github apps/developers that have access to variables. If you do not want to expose your api key you can use the Github action or self-hosted Github app.

Github app and Github action are both hosted by Github and will run on every comment to the repo, the bot will only respond to comments on a PR and only if the comment follows the format `ai fix: <filename>` or `ai fix: <file1>, <file2>`.

## Github app Usage

### Add the Github Variable

1. Go to the repo homepage which you want integrate this bot
2. click settings
3. click actions under secrets and variables
4. Change to Variables tab, create a new variable OPENAI_API_KEY with the value of your open api key.

### Add The Github App

Go to the [github app page](#) and install the app on the repo you want to use it on.

### Start Using

Go to an existing pull request (or create one) and comment `ai fix: <filename>` or `ai fix: <file1>, <file2>` and the bot will respond with a suggestion for the contents of the file. :tada: :rocket: your ready to go!

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

Example:

![Content Suggestions](./images/content-suggestions.png)

## Self-hosting on vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)

<!-- Use https://vercel.com/docs/integrations/deploy-button#generate-your-own to generate -->

For more details, refer to the [probot](https://probot.github.io/docs/development/) documentation.

## Development

### Setup

```sh
# Install dependencies
pnpm install

# Run the bot
pnpm watch
```

## Contributing

If you have suggestions for how the content suggestion bot could be improved or want to report a bug, open an issue! We welcome all contributions.

For more information, please refer to the [Contributing Guide](CONTRIBUTING.md).

## Credit

This project is inspired by [ChatGPT-CodeReview](https://github.com/anc95/ChatGPT-CodeReview).

# github-app-openai

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

## Contributing

If you have suggestions for how github-app-openai could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 Logan Anderson
