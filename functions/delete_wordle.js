"use strict";

const gitOpsApi = require("git-ops-api");
const serverUtils = require("../functions-common/serverUtils.js");
const fetchJSONFile = require("../functions-common/fetchJSONFile.js").fetchJSONFile;
const {
    Octokit
} = require("@octokit/core");

exports.handler = async function (event) {
    console.log("Received delete_wordle request at " + new Date() + " with path " + event.path);
    var wordleId = /delete_wordle\/(.*)/.exec(event.path)[1];

    // Reject the request when:
    // 1. Not a DELETE request;
    // 2. Doesn’t provide required values
    if (event.httpMethod !== "DELETE" || !serverUtils.isParamsExist([wordleId])) {
        return serverUtils.invalidRequestResponse;
    }

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    try {
        const wordleFiles = ["src/_data/" + wordleId + "-question.json", "src/_data/" + wordleId + "-answers.json"];
        let filesToDelete = [];
        for (let i = 0; i < wordleFiles.length; i++) {
            const fileExists = await fetchJSONFile(octokit, serverUtils.branchName, wordleFiles[i]);
            if (fileExists.exists) {
                filesToDelete.push({
                    path: wordleFiles[i],
                    operation: "delete"
                });
            }
        }

        if (filesToDelete.length > 0) {
            await gitOpsApi.commitMultipleFiles(octokit, {
                repoOwner: serverUtils.repoOwner,
                repoName: serverUtils.repoName,
                branchName: serverUtils.branchName,
                files: filesToDelete,
                commitMessage: "chore: [skip ci] delete wordle files with id " + wordleId
            });
            console.log("Done: the wordle with ID " + wordleId + " has been deleted.");
        }
        return {
            statusCode: 200,
            body: "Deleted successfully!"
        };
    } catch (e) {
        console.log("delete_wordle error: ", e);
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: e
            })
        };
    }
};
