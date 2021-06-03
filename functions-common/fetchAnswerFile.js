"use strict";

/**
 * Check if an aswer file in the given branch exists. If exists, along with the existence flag, return
 * `content` and `sha` of this file that will be used at the file update.
 * @param {Object} octokit - An instance of octokit with authentication being set.
 * @param {String} branch - The name of the branch that the file existence will be checked against.
 * @return {Promise} The resolved promise contains an object with a boolean flag keyed by `exists`. If
 * the file exists. The returned object contains `content` and `sha` information of the existing file,
 * which are needed when updating this file in the upcoming process.
 */
exports.fetchAnswerFile = async (octokit, branch) => {
    return new Promise((resolve, reject) => {
        octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
            headers: {
                "Cache-Control": "no-store, max-age=0"
            },
            owner: process.env.WORDLES_REPO_OWNER,
            repo: process.env.WORDLES_REPO_NAME,
            path: "src/_data/answers.json",
            ref: branch
        }).then((response) => {
            resolve({
                exists: true,
                content: JSON.parse(Buffer.from(response.data.content, "base64").toString("utf-8")),
                sha: response.data.sha
            });
        }, (e) => {
            // The answers file does not exist only when the returned response is "Not Found". All other error
            // responses indicate the request failure.
            if (e.message === "Not Found") {
                resolve({
                    exists: false
                });
            } else {
                reject("Error at checking the existence of the answers file: " + e.message);
            }

        });
    });
};
