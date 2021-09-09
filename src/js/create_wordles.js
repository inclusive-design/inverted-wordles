"use strict";

/* global globalOptions, inverted_wordles, openDialog, closeDialog, uuidv4 */

// Bind events for create buttons
inverted_wordles.bindCreateEvent = function () {
    const createButton = document.querySelector(globalOptions.selectors.createButton);
    createButton.addEventListener("click", evt => openDialog(globalOptions.createDialogId, evt.target.id, globalOptions.createCancelId));
};

inverted_wordles.appendNewWordleRow = function (branchName, lastModifiedTimestamp) {
    const newWordleRow = inverted_wordles.getWordleRow({
        branchName: branchName,
        workshopName: "",
        question: "",
        entries: "",
        lastModifiedTimestamp: lastModifiedTimestamp,
        statusMsg: "*Please wait few minutes until the Question link is generated and webpage is created. This may take a few minutes*",
        extraStatusClass: "purple",
        extraRowClass: "grey-background",
        disableInputs: true,
        isCreateNew: true
    });

    // append the new row to the wordle list
    document.querySelector(globalOptions.selectors.wordlesArea).innerHTML += newWordleRow;
};

inverted_wordles.updateNewWordleRow = function (branchName, lastModifiedTimestamp) {
    const wordlesListElm = document.querySelector(globalOptions.selectors.wordlesArea);
    // On the wordle list, find the row with the same branch name
    const branchNameElm = wordlesListElm.querySelector("input[value=\"" + branchName + "\"]");
    // Remove the old wordle row
    branchNameElm.parentElement.remove();
    // Find the status element for reporting errors when occuring
    const newWordleRow = inverted_wordles.getWordleRow({
        branchName: branchName,
        workshopName: "",
        question: "",
        entries: "",
        lastModifiedTimestamp: lastModifiedTimestamp
    });

    // append the new row to the wordle list
    document.querySelector(globalOptions.selectors.wordlesArea).innerHTML += newWordleRow;
};

window.createWordle = function (closeButton) {
    // close the confirmation dialog
    closeDialog(closeButton);

    const generalStatusElm = document.querySelector(globalOptions.selectors.status);
    const branchName = uuidv4();

    // create the branch
    fetch("/api/create_branch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            branchName: branchName
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
                inverted_wordles.appendNewWordleRow(branchName, lastModifiedTimestamp);
                // Disable "new question" button
                document.querySelector(globalOptions.selectors.createButton).disabled = true;

                // Check if the new branch has been deployed. The check runs every 2 seconds in 2 minutes.
                // The check stops in one of these two conditions:
                // 1. The site is not up running after 2 minutes;
                // 2. The deploy is up running.
                // When the new wordle web pages are deployed, update the wordle list with a proper row.
                let timesCheck = 0;
                let checkDeployInterval = setInterval(function () {
                    fetch("/api/check_deploy/" + branchName, {
                        method: "GET"
                    }).then(response => {
                        if (response.status === 200) {
                            response.json().then(res => {
                                console.log("deploy exists: ", res.exists);
                                if (res.exists) {
                                    clearInterval(checkDeployInterval);
                                    // Update the new wordle row to a regular row when the deploy is up and running
                                    inverted_wordles.updateNewWordleRow(branchName, lastModifiedTimestamp);
                                    document.querySelector(globalOptions.selectors.createButton).disabled = false;
                                }
                            });
                        }
                    });

                    timesCheck++;
                    if (timesCheck === 60) {
                        console.log("time is up, quit checkDeployInterval");
                        clearInterval(checkDeployInterval);
                    }
                }, 2000);
            });
        }
    }, error => {
        error.json().then(err => {
            inverted_wordles.reportStatus("Error at creating a new wordle: " + err.error, generalStatusElm, true);
        });
    });
};
