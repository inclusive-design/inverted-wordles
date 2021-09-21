"use strict";

/* global globalOptions, inverted_wordles, aria, uuidv4 */

// Bind events for create buttons
inverted_wordles.bindCreateEvent = function () {
    const createButton = document.querySelector(globalOptions.selectors.createButton);
    createButton.addEventListener("click", evt => aria.openDialog(globalOptions.createDialogId, evt.target.id, globalOptions.createCancelId));
};

inverted_wordles.createWordle = function () {
    const generalStatusElm = document.querySelector(globalOptions.selectors.status);
    const branchName = uuidv4();

    // create the branch
    fetch("/api/create_branch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            branchName
        })
    }).then(response => {
        // Javascript fetch function does not reject when the status code is between 400 to 600.
        // This range of status code needs to be handled specifically in the success block.
        // See https://github.com/whatwg/fetch/issues/18
        if (response.status >= 400 && response.status < 600) {
            response.json().then(res => {
                inverted_wordles.reportStatus("Error at creating a new wordle: " + res.error, generalStatusElm, true);
            });
        } else {
            response.json().then(res => {
                const lastModifiedTimestamp = res.lastModifiedTimestamp.substring(0, 10).replace(/-/g, "/");

                // Append the new wordle row to the wordle list
                inverted_wordles.appendInDeployWordleRow(globalOptions.selectors.wordlesArea, {
                    branchName,
                    workshopName: "",
                    question: "",
                    entries: 0,
                    lastModifiedTimestamp,
                    deployStatus: globalOptions.deployStatus.inProgress
                });

                // Bind the polling event to update the wordle row when the deploy is ready
                inverted_wordles.bindPolling(globalOptions.selectors.wordlesArea, globalOptions.selectors.createButton, {
                    branchName,
                    workshopName: "",
                    question: "",
                    entries: 0,
                    lastModifiedTimestamp
                });
            });
        }
    }, error => {
        error.json().then(err => {
            inverted_wordles.reportStatus("Error at creating a new wordle: " + err.error, generalStatusElm, true);
        });
    });
};
