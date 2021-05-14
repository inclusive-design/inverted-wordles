"use strict";

const {
    Octokit
} = require("@octokit/core");

const fetchAnswerFile = require("../functions-common/fetchAnswerFile.js").fetchAnswerFile;

exports.handler = async function (event) {
    console.log("Received fetch_answers request at " + new Date() + " with path " + event.path);
    var branch = /fetch_answer\/(.*)/.exec(event.path)[1];

    // Reject the request when:
    // 1. Not a GET request;
    // 2. Doesn’t provide required values
    if (event.httpMethod !== "GET" || !branch ||
        !process.env.ACCESS_TOKEN || !process.env.WORDLES_REPO_OWNER || !process.env.WORDLES_REPO_NAME) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid HTTP request method or missing field values or missing environment variables."
            })
        };
    }
    const octokit = new Octokit({
        auth: process.env.ACCESS_TOKEN
    });

    try {
        const answerFileInfo = await fetchAnswerFile(octokit, branch);
        console.log("Got answerFileInfo ", JSON.stringify(answerFileInfo));
        return {
            statusCode: 200,
            body: JSON.stringify(answerFileInfo.content)
        };
    } catch (e) {
        console.log("fetch_answers error: ", e);
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: e
            })
        };
    }
};
