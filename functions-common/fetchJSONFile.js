"use strict";

const gitOpsApi = require("git-ops-api");

/**
 * An object that contains file information.
 * @typedef {Object} FileInfo
 * The structure of FileInfo varies in three scenarios:
 * 1. When the file doesn't exist:
 * @param {Boolean} exists - The value is `false`.
 * 2. When the file exists:
 * @param {Boolean} exists - The value is `true`.
 * @param {String} content - The file content.
 * @param {String} sha - The sha value of the content blob.
 * 3. When the fetch fails:
 * @param {Boolean} isError - The value is `true`.
 * @param {String} message - The error message.
 */

/**
 * Check if an aswer file in the given branch exists. If exists, along with the existence flag, return
 * `content` and `sha` of this file that will be used at the file update.
 * @param {Object} octokit - An instance of octokit with authentication being set.
 * @param {String} branch - The name of the branch that the file existence will be checked against.
 * @param {String} filePath - The file path.
 * @return {Promise} The resolved promise contains an object defined in the typedef FileInfo.
 */
exports.fetchJSONFile = async (octokit, branch, filePath) => {
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
