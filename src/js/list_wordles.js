"use strict";

/* global inverted_wordles */

inverted_wordles.listWordles = function (wordles, wordlesAreaSelector, createButtonSelector, generalStatusSelector) {
    const generalStatusElm = document.querySelector(generalStatusSelector);

    fetch("/api/check_deploy", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            branches: Object.keys(wordles)
        })
    }).then(response => {
        // Javascript fetch function does not reject when the status code is between 400 to 600.
        // This range of status code needs to be handled specifically in the success block.
        // See https://github.com/whatwg/fetch/issues/18
        if (response.status >= 400 && response.status < 600) {
            response.json().then(res => {
                inverted_wordles.reportStatus("Error at populating the wordle list: " + res.error, generalStatusElm, true);
            });
        } else {
            response.json().then(res => {
                let wordlesHtml = document.querySelector(wordlesAreaSelector).innerHTML;
                let branchesInDeploy = {};

                // Loop through all wordles to separate ones that have been deployed or in the progress of deploy
                for (const [branchName, questionFile] of Object.entries(wordles)) {
                    const escapedQuestionData = {};
                    escapedQuestionData.workshopName = questionFile.exists && questionFile.content.workshopName ? inverted_wordles.escapeHtml(questionFile.content.workshopName) : "";
                    escapedQuestionData.question = questionFile.exists && questionFile.content.question ? inverted_wordles.escapeHtml(questionFile.content.question) : "";
                    escapedQuestionData.entries = questionFile.exists && questionFile.content.entries ? questionFile.content.entries : "";
                    escapedQuestionData.lastModifiedTimestamp = questionFile.exists && questionFile.content.lastModifiedTimestamp ? questionFile.content.lastModifiedTimestamp.substring(0, 10).replace(/-/g, "/") : "";
                    if (res[branchName]) {
                        wordlesHtml += inverted_wordles.renderWordleRow({
                            branchName,
                            workshopName: escapedQuestionData.workshopName,
                            question: escapedQuestionData.question,
                            entries: escapedQuestionData.entries,
                            lastModifiedTimestamp: escapedQuestionData.lastModifiedTimestamp,
                            disableInputs: false,
                            isCreateNew: false
                        });
                    } else {
                        branchesInDeploy[branchName] = escapedQuestionData;
                    }
                }
                // Add all branches that have been deployed to the wordle list
                document.querySelector(wordlesAreaSelector).innerHTML = wordlesHtml;

                // Append branches that are in the process of deploy to the wordle list
                for (const [branchName, questionFile] of Object.entries(branchesInDeploy)) {
                    inverted_wordles.appendInDeployWordleRow(wordlesAreaSelector, {
                        branchName,
                        workshopName: questionFile.workshopName,
                        question: questionFile.question,
                        entries: questionFile.entries,
                        lastModifiedTimestamp: questionFile.lastModifiedTimestamp
                    });

                    // Bind the polling event to update the wordle row when the deploy is ready
                    inverted_wordles.bindPolling(wordlesAreaSelector, createButtonSelector, {
                        branchName,
                        workshopName: res[branchName].workshopName,
                        question: res[branchName].question,
                        entries: res[branchName].entries,
                        lastModifiedTimestamp: res[branchName].lastModifiedTimestamp
                    });
                }
            });
        }
    }, error => {
        error.json().then(err => {
            inverted_wordles.reportStatus("Error at creating a new wordle: " + err.error, generalStatusElm, true);
        });
    });
};
