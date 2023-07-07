# Content Suggestion BOT

> A content suggestion robot powered by ChatGPT

This bot will make github suggestion comments to update the contents of a file in a PR

When ever a user comments `ai fix: <filename>` or `ai fix: <file1>, <file2>` the bot will respond with a suggestion for the contents of the file.

## Example

![Example](http://res.cloudinary.com/forestry-demo/image/upload/v1688483462/blog-media/supercharge-markdown-blog/Screenshot_2023-07-04_at_11.03.24_AM_bfqnld.png)

## Usage

This bot can be used in three ways:

1. As a Github action
2. As a Github app (self-hosted)

The easiest way to get started is to use the hosted Github app but do to so you will need to expose your openai api key as a [github variable](https://docs.github.com/en/actions/learn-github-actions/variables). While variables are not encrypted they are only exposed accessible to Github apps/developers that have access to variables. If you do not want to expose your api key you can use the Github action or self-hosted Github app.

Github app and Github action are both hosted by Github and will run on every comment to the repo, the bot will only respond to comments on a PR and only if the comment follows the format `ai fix: <filename>` or `ai fix: <file1>, <file2>`. A prompt can also be added by adding a adding `prompt: <prompt>` after the filename to the to the comment.

For example:

```
ai fix: README.md
prompt: Fix only the spelling and grammar errors in the README
```

![Example](http://res.cloudinary.com/forestry-demo/image/upload/v1688736596/blog-media/supercharge-markdown-blog/Screenshot_2023-07-07_at_8.41.32_AM_xsoswd.png)

## Github app Usage

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

## Self-hosting on vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)

This will clone the repo to your github account and deploy it to vercel. Before deploying you will need to set the following environment variables:

```env
# The Github App ID
APP_ID=***
The Client ID of the Github App
GITHUB_CLIENT_ID***
The Client Secret of the Github App
GITHUB_CLIENT_SECRET=***
# The private key of the Github App (Copy and pasted from the .pem file)
PRIVATE_KEY=***
# The webhook secret of the Github App (User generated and pasted into the Github App)
WEBHOOK_SECRET=***
```

For more details, refer to the [probot](https://probot.github.io/docs/development/#manually-configuring-a-github-app) documentation.

## Contributing

If you have suggestions for how the content suggestion bot could be improved or want to report a bug, open an issue! We welcome all contributions.

For more information, please refer to the [Contributing Guide](CONTRIBUTING.md).

## Credit

This project is inspired by [ChatGPT-CodeReview](https://github.com/anc95/ChatGPT-CodeReview).

## Contributing

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2023 Logan Anderson
