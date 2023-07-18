## Contributing

[fork]: /fork
[pr]: /compare
[code-of-conduct]: CODE_OF_CONDUCT.md

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a [Contributor Code of Conduct][code-of-conduct]. By participating in this project you agree to abide by its terms.

## Issues and PRs

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions. If you have questions, too, we'd love to hear them.

We'd also love PRs. If you're thinking of a large PR, we advise opening up an issue first to talk about it, though! Look at the links below if you're not sure how to open a PR.

## Submitting a pull request

1. [Fork][fork] and clone the repository.
2. Configure and install the dependencies: `pnpm install`.
3. Run the Github App locally
   1. Make a GitHub App on your account by by following the instructions [here](https://probot.github.io/docs/development/#manually-configuring-a-github-app).
   2. Make sure all environment variables are set. See `.env.example` for the required variables.
   3. run `pnpm watch` to run a local dev sever
   4. run `pnpm build` to build the github app
   5. run `pnpm start` to start the github app
   6. run `pnpm build:action` to build the github action
4. Make sure the tests pass on your machine: `pnpm test`
5. Create a new branch: `git checkout -b my-branch-name`.
6. Make your change, add tests, and make sure the tests still pass.
7. Push to your fork and [submit a pull request][pr].
8. Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Write and update tests.
- Keep your changes as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you.

## How to update the Github action

Make sure you are on the latest version of the main branch. After that you can checkout to a new branch.

EXAMPLE: `git checkout -b v0.1`

Next run the build command to build the action.

```bash
pnpm build:action
```

This will create a new folder called `dist` with the action inside. Add the dist folder to git by running

```bash
 git add dist/ -f
```

Now you can push up the branch to github and reference it in your action file. Eg: `tinacms/ai-content@v0.1`

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)
