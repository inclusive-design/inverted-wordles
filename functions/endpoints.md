# Supported Netlify Endpoints

## Check Netlify Site (GET /api/check_netlify_site)

* **description**: Check if the GitHub repository defined via process.env.REPOSITORY_URL is a Netlify site.
* **method:** `GET`
* **route:** `/api/check_netlify_site`
* **return:** A JSON document containing a boolean value indicating if the current GitHub repository is a Netlify
site. If it is, the value is `true`. Otherwise, the state is `false`.

```json
{
    "isNetlifySite": true
}
```

## Fetch Word Clouds (GET /api/fetch_wordles)

* **description**: Fetch the netlify site name and all word clouds.
* **method:** `GET`
* **route:** `/api/fetch_wordles`
* **return:** A JSON document containing all word clouds.

```json
{
    "netlifySiteName": "inverted-wordles",
    "wordles": {
        "77d4f4bc-5b98-4e1f-9348-d684a6431877": {
            "content": {
                "workshopName": "Accessibility Workshop",
                "question": "What are three most important problems to be addressed by inclusive design?",
                "entries": 3,
                "entryMaxLength": 80,
                "createdTimestamp": "2021-05-05T18:03:02.752Z",
                "lastModifiedTimestamp": "2021-05-05T18:03:02.752Z"
            },
            "exists": true,
            "sha": "c150e89017167f06cbd0e809ed66fb070696e626"
        }
        ...
    }
}
```

## Fetch a Word Cloud Question (GET /api/fetch_question/:wordleId)

* **description**: Fetch a word cloud question.
* **method:** `GET`
* **route:** `/api/fetch_question/:wordleId` where:
    * `wordleId`: A word cloud ID.
* **return:** A JSON document containing the question information of a word cloud.

```json
{
    "workshopName": "Accessibility Workshop",
    "question": "What are three most important problems to be addressed by inclusive design?",
    "entries": 3,
    "entryMaxLength": 80,
    "createdTimestamp": "2021-05-05T18:03:02.752Z",
    "lastModifiedTimestamp": "2021-05-05T18:03:02.752Z"
}
```

## Fetch Answers for a Word Cloud (GET /api/fetch_answer/:wordleId)

* **description**: Fetch answers for a word cloud.
* **method:** `GET`
* **route:** `/api/fetch_answer/:wordleId` where:
    * `wordleId`: A word cloud ID.
* **return:** A JSON document containing answers.

```json
{
    "uuid": {
        "answers": ["answer1", "answer2", ...],
        "createdTimestamp": "2021-09-23T17:50:57.143Z"
    }
}
```

## Save a Wordle Question (POST /api/save_question)

* **description**: Save the updated question information for a word cloud.
* **method:** `POST`
* **route:** `/api/save_question` with these parameters in the `POST` body using the `application/json` Content-Type.
    * `wordleId`: The word cloud ID.
    * `workshop-name`: Optional. The workshop name.
    * `question`: Optional. The word cloud question.
    * `entries`: Optional. Number of answers allowed when answering this question.
* **return:** A JSON document containing the updated content of the question file.

```json
{
    "workshopName": "Accessibility Workshop",
    "question": "What are three most important problems to be addressed by inclusive design?",
    "entries": 3,
    "entryMaxLength": 80,
    "createdTimestamp": "2021-05-05T18:03:02.752Z",
    "lastModifiedTimestamp": "2021-05-05T18:03:02.752Z"
}
```

## Save Answers for a Word Cloud (POST /api/save_answers)

* **description**: Fetch answers for a word cloud. If the answer file for this word cloud doesn't exist, create it.
Otherwise, update the answers file with new answers.
* **method:** `POST`
* **route:** `/api/save_answers` with these parameters in the `POST` body using the `application/json` Content-Type.
    * `wordleId`: The word cloud ID.
    * `requestId`: a string of a request id.
    * `answers`: an array containing answers
* **return:** A JSON document containing answers.

```json
{
    "wordleId": "77d4f4bc-5b98-4e1f-9348-d684a6431877",
    "answers": ["answer1", "answer2", ...],
    "requestId": "w68g2o"
}
```

## Create a New Word Cloud (POST /api/create_question)

* **description**: Create a new wordle question.
* **method:** `POST`
* **route:** `/api/create_question` with these parameters in the `POST` body using the `application/json` Content-Type.
    * `wordleId`: A word cloud ID.
```
{
    "wordleId": "77d4f4bc-5b98-4e1f-9348-d684a6431877"
}
```
* **return:** A JSON document containing the word cloud ID that has been created, along with a timestamp of when it's
created.

```json
{
    "wordleId": "77d4f4bc-5b98-4e1f-9348-d684a6431877",
    "lastModifiedTimestamp": "2021-09-23T17:50:57.143Z"
}
```

## Delete a Word Cloud (DELETE /api/delete_wordle/:wordleId)

* **description**: Delete a word cloud.
* **method:** `DELETE`
* **route:** `/api/delete_wordle/:wordleId` where:
    * `wordleId`: A word cloud ID.
* **return:** A success message when a deletion completes successfully.

```json
"Deleted successfully!"
```
