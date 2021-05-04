# Inverted Wordles

This project allows users to create word cloud questions. Answers to each question will be gathered to build an
inverted Wordle that highlights minority answers.

The front end of the project is built with [Eleventy](https://11ty.dev/). The website is deployed on
[Netlify](https://www.netlify.com/).

## Install

To work on the project, you need to install [NodeJS and NPM](https://nodejs.org/en/download/) for your operating
system.

Then, clone the project from GitHub. [Create a fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)
with your GitHub account, then enter the following in your command line (make sure to replace `your-username` with your username):

```bash
git clone https://github.com/your-username/inverted-wordles
```

From the root of the cloned project, enter the following in your command line to install dependencies:

```bash
npm ci
```

## Development

### Development without Netlify endpoints

When working on webpages that don't need the support of Netlify endpoints, run:

```bash
npm run dev
```

The website will be available at http://localhost:3000

### Development with Netlify endpoints

This project uses individual Github branch to save the question and answers for each wordle case. The repo that branches
are created against is defined in [`env.wordleRepo`](src/_data/env.js). The account used to create and commit into Github
branches must provide a personal access token that has `repo` access. Refer to [the Github documentation](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
about how to create a personal access token.

This personal access token must be defined as a environment variable named `ACCESS_TOKEN`.

Follow [Netlify instructions](https://docs.netlify.com/functions/build-with-javascript/#tools) to install tools for testing
and deploying Netlify functions locally. Once the tool is set up, run:

```bash
export ACCESS_TOKEN=GITHUB-PERSONAL-ACCESS-TOKEN
netlify dev
```

Look for this box in your console output:

```bash
   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   * Server now ready on http://localhost:64939   │
   │                                                  │
   └──────────────────────────────────────────────────┘
```

The website will be available at [http://localhost:64939](http://localhost:64939).

Alternatively, a `.env` file can be created within the local project directory and
environment variables can be added directly to it as follows:

```env
ACCESS_TOKEN=GITHUB-PERSONAL-ACCESS-TOKEN
```

(Note: `.env` is in the project's `.gitignore` file to prevent sensitive information from being accidentally
committed to git.)

If a `.env` file is used, the local development server can be started with the following command:

```bash
netlify dev
```

### Lint

To lint the source code, run:

```bash
npm run lint
```
