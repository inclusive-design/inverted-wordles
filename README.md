# Inverted Word Clouds

This project allows users to create word cloud questions. Answers to each question will be gathered to build an
inverted Word Cloud that highlights minority answers.

The front end of the project is built with [Eleventy](https://11ty.dev/). The website is deployed on
[Netlify](https://www.netlify.com/). The word cloud data is saved in [the inclusive-design/inverted-wordles GitHub
repository](https://github.com/inclusive-design/inverted-wordles/).

When a new word cloud question is created or an existing word cloud question is modified, the new/updated question is pushed
into the GitHub repository that triggers Netlify to deploy/re-deploy the word cloud website. The detail of the architecture
of this project can be found at [Inverted Word Clouds Architecture wiki page](https://fluidproject.atlassian.net/wiki/spaces/fluid/pages/11588419/Inverted+Word+Clouds+Architecture).

The live website lives at [https://inverted-wordclouds.inclusivedesign.ca/](https://inverted-wordclouds.inclusivedesign.ca/).

## How to Use

### Create a Word Cloud

Creating word clouds requires login access. Access it on the "Manage Word Clouds" homepage.

**Steps**

1. **Login** using the provided credentials.
    - After logging in, the "Login" button will change to a "Logout" button.
2. **Create a New Question**:
    - Click the "+ New Question" button, which appears next to the "Logout" button.
    - A new row with empty fields will be added at the bottom of the word cloud table.
3. **Fill in the Details**:
    - Complete the "Workshop Name", "Question", and "Word Entries" fields.
    - The "Word Entries" field specifies the number of answers a workshop attendee can submit.

**Note**:
- Each value will be automatically saved when you finish typing and leave the field. 
- Saving may take a moment, depending on your internet speed.
- After creating the word cloud, refresh the page to ensure all values are correctly saved in their respective fields.

### Delete a Word Cloud

Deleting word clouds requires login access.  Access it on the "Manage Word Clouds" homepage.

**Steps**

1. **Login** using the provided credentials.
    - After logging in, the "Login" button will change to a "Logout" button.
2. **Locate the Word Cloud**:
    - In the word cloud table, find the row corresponding to the word cloud you want to delete.
3. **Delete the Word Cloud**:
    - Click the "X Delete" button in the rightmost column of the selected row to delete the word cloud.

### Submit Answers to A Word Cloud's Question

Submitting answers doesn't require login access. The URL of the submission page is in the format "/answer/?id=xxx".

**Steps**

1. **Find the Submit Answers Page for the Word Cloud**:
    - In the word cloud table, locate the row corresponding to the word cloud for which you want workshop
    attendees to submit answers.
2. **Locate the Submit Answers Page**:
    - Click the "View" button in the "Answers" column of the desired row, which will take you to the Submit
    Answers page.
    - Provide the URL of the Submit Answers page to the workshop attendees.
3. **Workshop Attendees Submit Answers**:
    - Workshop attendees open the submit answers page to submit their answers.
    - The max length for each answer is 80 characters.
    - The number of answer fields shown on the page corresponds to the "Word Entries" value of the predefined
    word cloud. If the number of fields is incorrect or no input fields are displayed, go to the "Manage Word
    Clouds" page to check and update the "Word Entries" value.

### View a Word Cloud

Viewing word clouds doesn't require login access. The URL of the view page is in the format "/wordle/?id=xxx".

**Steps**

1. **Find the View Page for the Word Cloud**:
    - In the word cloud table, locate the row corresponding to the word cloud you want to view.
2. **Locate the View Page**:
    - Click the "View" button in the "Word Cloud" column of the desired row to go to the view page.
    - This page auto-refreshes every 5 seconds by polling submitted answers to ensure newly submitted answers
    are captured and displayed.
3. **Settings on the Page**:
    - There are two settings at the bottom of this page:
        - **"Speak the word cloud text under the pointer"**: Controls whether the text under the mouse pointer
        will be read out when you move the mouse cursor over the text in the word cloud area. The larger the
        font size, the higher the voice pitch.
        - **"Apply conventional weighting"**: When enabled, more frequently submitted words will be highlighted.

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

This project uses individual Github branch to save the question and answers for each word cloud case. The required
information for accessing the Github repository are defined in these environment variables:

* REPOSITORY_URL: Optional. The GitHub repository URL that word clouds are operated on. For example:
`https://github.com/inclusive-design/inverted-wordles`. This variable needs to be manually defined when running
the project locally via `netlify dev`. With real Netlify deployed sites, it is automatically available as a Netlify
build time environment variable. See [the Netlify build environment variables - Git metadata](https://docs.netlify.com/configure-builds/environment-variables/#git-metadata).
* BRANCH: Optional. The GitHub remote branch that the word cloud data are fetched from. For example:
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
`REPOSITORY_URL` environment variable. The word cloud data will be fetched from this remote branch.

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

| Succecss Criterion | Manage Word Clouds | Answer A Word Cloud's Question | View A Word Cloud |
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
