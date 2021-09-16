"use strict";

/* global globalOptions, inverted_wordles */

inverted_wordles.listWordles = function (wordles, wordlesAreaSelector, generalStatusSelector) {
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
                let branchesInDeploy = [];

                // Add all branches that have been deployed to the wordle list
                for (const [branchName, questionFile] of Object.entries(wordles)) {
                    const workshopName = questionFile.exists && questionFile.content.workshopName ? inverted_wordles.escapeHtml(questionFile.content.workshopName) : "";
                    const question = questionFile.exists && questionFile.content.question ? inverted_wordles.escapeHtml(questionFile.content.question) : "";
                    const entries = questionFile.exists && questionFile.content.entries ? questionFile.content.entries : "";
                    const lastModifiedTimestamp = questionFile.exists && questionFile.content.lastModifiedTimestamp ? questionFile.content.lastModifiedTimestamp.substring(0, 10).replace(/-/g, "/") : "";
                    if (res[branchName]) {
                        inverted_wordles.renderWordleRow({
                            branchName,
                            workshopName,
                            question,
                            entries,
                            lastModifiedTimestamp,
                            disableInputs: false,
                            isCreateNew: false
                        });
                    } else {
                        branchesInDeploy.push(branchName);
                    }
                }
                document.querySelector(wordlesAreaSelector).innerHTML = wordlesHtml;

                // Append branches that are in the process of deploy to the wordle list
                for (const branchName in branchesInDeploy) {
                    inverted_wordles.renderWordleRow({
                        branchName,
                        workshopName: res[branchName].workshopName,
                        question: res[branchName].question,
                        entries: res[branchName].entries,
                        lastModifiedTimestamp: res[branchName].lastModifiedTimestamp,
                        statusMsg: "*Please wait until the question link is generated and webpage is created. This may take 30 seconds*",
                        extraStatusClass: "purple",
                        extraRowClass: "grey-background",
                        disableInputs: true,
                        isCreateNew: true
                    });

                    // Bind the polling event to update the wordle row when the deploy is ready
                    inverted_wordles.bindPolling(globalOptions.selectors.wordlesArea, globalOptions.selectors.createButton, {
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
