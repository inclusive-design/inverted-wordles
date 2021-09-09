"use strict";

const {
    Octokit
} = require("@octokit/core");

const gitOpsApi = require("git-ops-api");

exports.handler = async function (event) {
    console.log("Received create_branch request at " + new Date() + " with path " + event.path);
    const branchName = JSON.parse(event.body).branchName;

    // Reject the request when:
    // 1. Not a POST request;
    // 2. Doesn’t provide required values;
    if (event.httpMethod !== "POST" || !branchName ||
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
        console.log("Create a new branch: ", branchName);
        await gitOpsApi.createBranch(octokit, {
    		repoOwner: process.env.WORDLES_REPO_OWNER,
    		repoName: process.env.WORDLES_REPO_NAME,
    		baseBranchName: "main",
    		targetBranchName: branchName
    	});

        return {
            statusCode: 200,
            body: JSON.stringify({
                branchName: branchName,
                lastModifiedTimestamp: new Date().toISOString()
            })
        };
    } catch (e) {
        console.log("create_branch error: ", e);
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: e
            })
        };
    }
};
