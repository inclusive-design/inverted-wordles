# Inverted Wordles

This project allows users to create word cloud questions. Answers to each question will be gathered to build an
inverted Wordle that highlights minority answers.

The front end of the project is built with [Eleventy](https://11ty.dev/). The website is deployed on
[Netlify](https://www.netlify.com/). The wordle data is saved in [the inclusive-design/inverted-wordles GitHub
repository](https://github.com/inclusive-design/inverted-wordles/).

When a new wordle question is created or an existing wordle question is modified, the new/updated question is pushed
into the GitHub repository that triggers Netlify to deploy/re-deploy the wordle website. The detail of the architecture
of this project can be found at [Inverted Wordles Architecture wiki page](https://wiki.fluidproject.org/display/fluid/Inverted+Wordles+Architecture).

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

To test the project in a self-contained way, follow steps below to deploy a personal cloned `inverted-wordles`
GitHub repository with Netlify.

* Sign up with [Netlify](https://netlify.com/)
* Follow [the Netlify documentation](https://docs.netlify.com/site-deploys/create-deploys/#deploy-with-git) to connect
a GitHub repository with a Netlify site
* Go to Netlify "Site settings" -> "Build & deploy" section
    * In "Branches" -> set "Branch deploys" to "All" (Deploy all the branches pushed to the repository)
    * In "Environment" -> add environment variables. See "Environment Variables" section below to find out
    what variables need to be defined
* Go to Netlify Identity, enable identity service then invite yourself and others who will use your inverted-wordles
site.

### Development without Netlify endpoints

When working on webpages that don't need the support of Netlify endpoints, run:

```bash
npm run dev
```

The website will be available at http://localhost:3000

### Development with Netlify endpoints

#### Environment Variables

This project uses individual Github branch to save the question and answers for each wordle case. The required
information for accessing the Github repository are defined in these environment variables:

* REPOSITORY_URL: Optional. The GitHub repository URL that wordles are operated on. For example:
`https://github.com/inclusive-design/inverted-wordles`. This variable needs to be manually defined when running
the project locally via `netlify dev`. With real Netlify deployed sites, it is automatically available as a Netlify
build time environment variable. See [the Netlify build environment variables - Git metadata](https://docs.netlify.com/configure-builds/environment-variables/#git-metadata).
* BRANCH: Optional. The GitHub remote branch that the wordle data are fetched from. For example:
`main`. This environment variable is automatically available as a Netlify build time environment variable with real
Netlify deployed sites and local netlify sites started via `netlify dev`. See
[the Netlify build environment variables - Git metadata](https://docs.netlify.com/configure-builds/environment-variables/#git-metadata).
* GITHUB_TOKEN: The personal access token of the account for authenticating the access to the Github repository. This
access token must have `repo` access. Refer to [the Github documentation](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
about how to create a personal access token.
* NETLIFY_TOKEN: The personal access token of the Netlify account for authenticating the access to the Netlify API.
Refer to [the Netlify documentation](https://docs.netlify.com/api/get-started/#authentication) about how to create
a personal access token.

#### Run with Local Netlify Endpoints

Follow [Netlify instructions](https://docs.netlify.com/functions/build-with-javascript/#tools) to install tools for testing
and deploying Netlify functions locally.

Make sure your local branch is pushed up with the same branch name to the GitHub repository defined in the
`REPOSITORY_URL` environment variable. The wordle data will be fetched from this remote branch.

Once the tool is set up, run:

```bash
export REPOSITORY_URL=YOUR-REPOSITORY-URL
export GITHUB_TOKEN=YOUR-PERSONAL-ACCESS-TOKEN
export NETLIFY_TOKEN=YOUR-NETLIFY-ACCOUNT-PERSONAL-ACCESS-TOKEN
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
REPOSITORY_URL=YOUR-REPOSITORY-URL
GITHUB_TOKEN=YOUR-PERSONAL-ACCESS-TOKEN
NETLIFY_TOKEN=YOUR-NETLIFY-ACCOUNT-PERSONAL-ACCESS-TOKEN
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

### Internationalization

The website supports bilingual content in English and French. The implementation of internationalization (i18n)
is achieved through two scripts:

1. `src/js/translations.js`: This script defines a global variable `inverted_wordles.languages` that contains
all phrase translations for English and French. When adding or updating a phrase, you need to update this object
accordingly.

2. `src/js/i18n.js`: This script defines the following global variables and functions:

* `supportedLanguages`: An array containing the supported language codes, e.g., `["en", "fr"]`.
* `defaultLanguage`: The default language code to be used at page load, e.g., `"en"`.
* `currentLanguage`: The user's selected language code, falling back to `defaultLanguage` if no preference is set.
* `translations`: An object that stores the translations for the current selected language.
* `inverted_wordles.t`*: A translation function that returns the translated phrase for a given phrase key based
on the current language.

This script is responsible for translating the website content to the selected language upon page load and language
change events. The following special HTML attributes are used to identify phrases and elements that need to be
translated:

* `data-i18n-textcontent`: Updates the `textContent` of the element with the translated phrase.
* `data-i18n-placeholder`: Updates the value of the `placeholder` attribute with the translated phrase.
* `data-i18n-link`: Used for <a> links that lead to other pages. The href URL is updated by appending or updating
the `lang` query parameter with the `currentLanguage` value.
* `data-i18n-arialabel`: Updates the `aria-label` value with the translated phrase.

## Accessibility

This website meets WCAG 2.0 Level AA conformance.

### Accessibility Testing Summary

**Icon Legend:**

* :heavy_check_mark:: No violations found
* X: Violations found
* -: Not applicable

| Succecss Criterion | Manage Wordles | Submit Answers | View Wordle |
| -------- | ------- | -------- | ------- |
| 1.1.1 Non-text content | - | - | - |
| 1.2.1 Audio-only and video-only | - | - | - |
| 1.2.2. Captions | - | - | - |
| 1.2.3 Audio Description or Text Alternative | - | - | - |
| 1.3.1. Information and relationships | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 1.3.2 Meaningful Sequence | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 1.3.3 Sensory Characteristics | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 1.4.1. Use of Colour | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 1.4.2. Audio Control | - | - | - |
| 1.4.3 Contrast Minimum | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 1.4.4 Resize text | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 1.4.5 Images of Text | - | - | - |
| 2.1.1 Keyboard | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 2.1.2 Keyboard trap | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 2.2.1 Timing Adjustable | - | - | - |
| 2.2.2 Pause, Stop, Hide | - | - | - |
| 2.3.1. Flashing content | - | - | - |
| 2.4.1 Bypass blocks | - | - | - |
| 2.4.2 Page titled | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 2.4.3. Focus order | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 2.4.4. Link purpose | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 2.4.5 Multiple Ways | - | - | - |
| 2.4.6 Headings and Labels | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 2.4.7. Focus Visible | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.1.1 Langauge | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.1.2. Language of Parts | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.2.1 On Focus | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.2.2. On input | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.2.3 Consistent Navigation | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.2.4 Consistent Identification | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.3.1 Error Identification | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.3.2 Labels or Instructions | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.3.3 Error suggestion | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 3.3.4 Error Prevention | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 4.1.1 Parsing | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| 4.1.2 Name Role Value | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
