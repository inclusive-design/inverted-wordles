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

## Supported Netlify Endpoints

### Check Deploy State (POST /api/check_deploy)

* **description**: Check deploy states of one or more wordles.
* **method:** `POST`
* **route:** `/api/check_deploy` with these parameters in the `POST` body using the `application/json` Content-Type.
    * `branches`: An array of GitHub branch names.
```
{
    "branches": ["branch1", "branch2", ...]
}
```
* **return:** A JSON document containing the deploy state for every single branch. The deploy state is `true` when
a branch has been successfully deployed. Otherwise, the state is `false`.

```json
{
    "branch1": true,
    "branch2": false,
    ...
}
```

### Check Netlify Site (GET /api/check_netlify_site)

* **description**: Check if the GitHub repository defined via process.env.WORDLES_REPO_OWNER and
process.env.WORDLES_REPO_NAME is a Netlify site.
* **method:** `GET`
* **route:** `/api/check_deploy`
* **return:** A JSON document containing a boolean value indicating if the current GitHub repository is a Netlify
site. If it is, the value is `true`. Otherwise, the state is `false`.

```json
{
    "isNetlifySite": true
}
```

### Fetch Wordles (GET /api/fetch_wordles)

* **description**: Fetch all wordles. The main branch is excluded from the list.
* **method:** `GET`
* **route:** `/api/fetch_wordles`
* **return:** A JSON document containing all wordles.

```json
{
    "a11y-workshop": {
        "content": {
            "workshopName": "Accessibility Workshop",
            "question": "What are three most important problems to be addressed by inclusive design?",
            "entries": 3,
            "entryMaxLength": 80,
            "createdTimestamp": "2021-05-05T18:03:02.752Z",
            "lastModifiedTimestamp": "2021-05-05T18:03:02.752Z",
            "branch": "a11y-workshop"
        },
        "exists": true,
        "sha": "c150e89017167f06cbd0e809ed66fb070696e626"
    }
    ...
}
```

### Fetch a Wordle Question (GET /api/fetch_question/:branchName)

* **description**: Fetch a wordle question.
* **method:** `GET`
* **route:** `/api/fetch_question/:branchName` where:
    * `branchName`: A branch name.
* **return:** A JSON document containing the question information of a wordle.

```json
{
    "workshopName": "Accessibility Workshop",
    "question": "What are three most important problems to be addressed by inclusive design?",
    "entries": 3,
    "entryMaxLength": 80,
    "createdTimestamp": "2021-05-05T18:03:02.752Z",
    "lastModifiedTimestamp": "2021-05-05T18:03:02.752Z",
    "branch": "a11y-workshop"
}
```

### Fetch Answers for a Wordle (GET /api/fetch_answer/:branchName)

* **description**: Fetch answers for a wordle.
* **method:** `GET`
* **route:** `/api/fetch_answer/:branchName` where:
    * `branchName`: A branch name.
* **return:** A JSON document containing answers.

```json
{
    "uuid": {
        "answers": ["answer1", "answer2", ...],
        "createdTimestamp": "2021-09-23T17:50:57.143Z"
    }
}
```

### Save a Wordle Question (POST /api/save_question)

* **description**: Save the question information for a wordle.
* **method:** `POST`
* **route:** `/api/save_question` with these parameters in the `POST` body using the `application/json` Content-Type.
    * `branch`: The branch name for a wordle.
    * `workshop-name`: Optional. The workshop name.
    * `question`: Optional. The wordle question.
    * `entries`: Optional. Number of answers allowed when answering this question.
* **return:** A JSON document containing the updated content of the question file.

```json
{
    "workshopName": "Accessibility Workshop",
    "question": "What are three most important problems to be addressed by inclusive design?",
    "entries": 3,
    "entryMaxLength": 80,
    "createdTimestamp": "2021-05-05T18:03:02.752Z",
    "lastModifiedTimestamp": "2021-05-05T18:03:02.752Z",
    "branch": "a11y-workshop"
}
```

### Save Answers for a Wordle (POST /api/save_answers)

* **description**: Fetch answers for a wordle. If the answer file for this wordle doesn't exist, create it. Otherwise,
update the answers file with new answers.
* **method:** `POST`
* **route:** `/api/save_answers` with these parameters in the `POST` body using the `application/json` Content-Type.
    * `branch`: The branch name for a wordle.
    * `requestId`: a string of a request id.
    * `answers`: an array containing answers
* **return:** A JSON document containing answers.

```json
{
    "branch": "a11y-workshop",
    "answers": ["answer1", "answer2", ...],
    "requestId": "w68g2o"
}
```

### Create a New Wordle (POST /api/create_branch)

* **description**: Check a new branch in the wordle GitHub repository.
* **method:** `POST`
* **route:** `/api/create_branch` with these parameters in the `POST` body using the `application/json` Content-Type.
    * `branchName`: A branch name.
```
{
    "branchName": "a-new-branch"
}
```
* **return:** A JSON document containing the branch name that has been created, along with a timestamp of when it's
created.

```json
{
    "branchName": "a-new-branch",
    "lastModifiedTimestamp": "2021-09-23T17:50:57.143Z"
}
```

### Delete a Wordle (DELETE /api/delete_wordle/:branchName)

* **description**: Delete a branch.
* **method:** `DELETE`
* **route:** `/api/delete_wordle/:branchName` where:
    * `branchName`: A branch name.
* **return:** A success message when a deletion completes successfully.

```json
"Deleted successfully!"
```

## Development

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

* WORDLES_REPO_OWNER: The owner of the Github repository that the wordle data is saved into.
* WORDLES_REPO_NAME: The name of the Github repository that the wordle data is saved into.
* ACCESS_TOKEN: The personal access token of the account for authenticating the access to the Github repository. This
access token must have `repo` access. Refer to [the Github documentation](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)
about how to create a personal access token.
* NETLIFT_TOKEN: The personal access token of the Netlify account for authenticating the access to the Netlify API.
Refer to [the Netlify documentation](https://docs.netlify.com/api/get-started/#authentication) about how to create
a personal access token.

An example for finding out `WORDLES_REPO_OWNER` and `WORDLES_REPO_NAME` values: if the URL of a Github repository is
`https://github.com/inclusive-design/inverted-wordles`, the value of `WORDLES_REPO_OWNER` is `inclusive-design` and the
value of `WORDLES_REPO_NAME` is `inverted-wordles`.

#### Run with Local Netlify Endpoints

Follow [Netlify instructions](https://docs.netlify.com/functions/build-with-javascript/#tools) to install tools for testing
and deploying Netlify functions locally. Once the tool is set up, run:

```bash
export WORDLES_REPO_OWNER=YOUR-WORDLES_REPO_OWNER
export WORDLES_REPO_NAME=YOUR-WORDLES_REPO_NAME
export ACCESS_TOKEN=YOUR-GITHUB-ACCOUNT-PERSONAL-ACCESS-TOKEN
export NRTLIFY_TOKEN=YOUR-NETLIFY-ACCOUNT-PERSONAL-ACCESS-TOKEN
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
WORDLES_REPO_OWNER=YOUR-WORDLES_REPO_OWNER
WORDLES_REPO_NAME=YOUR-WORDLES_REPO_NAME
ACCESS_TOKEN=YOUR-GITHUB-ACCOUNT-PERSONAL-ACCESS-TOKEN
NRTLIFY_TOKEN=YOUR-NETLIFY-ACCOUNT-PERSONAL-ACCESS-TOKEN
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
