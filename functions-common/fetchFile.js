"use strict";

const gitOpsApi = require("git-ops-api");

/**
 * Check if an aswer file in the given branch exists. If exists, along with the existence flag, return
 * `content` and `sha` of this file that will be used at the file update.
 * @param {Object} octokit - An instance of octokit with authentication being set.
 * @param {String} branch - The name of the branch that the file existence will be checked against.
 * @param {String} filePath - The file path.
 * @return {Promise} The resolved promise contains an object with a boolean flag keyed by `exists`. If
 * the file exists. The returned object contains `content` and `sha` information of the existing file,
 * which are needed when updating this file in the upcoming process.
 */
exports.fetchFile = async (octokit, branch, filePath) => {
    const response = await gitOpsApi.fetchRemoteFile(octokit, {
        repoOwner: process.env.WORDLES_REPO_OWNER,
        repoName: process.env.WORDLES_REPO_NAME,
        branchName: branch,
        filePath: filePath
    });

    if (response.content) {
        response.content = JSON.parse(response.content);
    }

    return response;
};
