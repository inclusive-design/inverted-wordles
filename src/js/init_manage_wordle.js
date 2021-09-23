"use strict";

/* global inverted_wordles */

inverted_wordles.manage.renderWordles = function (wordles, deployStatus, options) {
    const wordlesAreaSelector = options.selectors.wordlesArea;

    let wordlesHtml = document.querySelector(wordlesAreaSelector).innerHTML;
    let branchesInDeploy = {};

    // Loop through all wordles to separate ones that have been deployed or in the progress of deploy
    for (const [branchName, questionFile] of Object.entries(wordles)) {
        const escapedQuestionData = {};
        escapedQuestionData.workshopName = questionFile.exists && questionFile.content.workshopName ? inverted_wordles.manage.escapeHtml(questionFile.content.workshopName) : "";
        escapedQuestionData.question = questionFile.exists && questionFile.content.question ? inverted_wordles.manage.escapeHtml(questionFile.content.question) : "";
        escapedQuestionData.entries = questionFile.exists && questionFile.content.entries ? questionFile.content.entries : "";
        escapedQuestionData.lastModifiedTimestamp = questionFile.exists && questionFile.content.lastModifiedTimestamp ? questionFile.content.lastModifiedTimestamp.substring(0, 10).replace(/-/g, "/") : "";
        if (deployStatus[branchName]) {
            wordlesHtml += inverted_wordles.manage.renderWordleRow({
                branchName,
                workshopName: escapedQuestionData.workshopName,
                question: escapedQuestionData.question,
                entries: escapedQuestionData.entries,
                lastModifiedTimestamp: escapedQuestionData.lastModifiedTimestamp,
                deployStatus: options.deployStatus.ready,
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
        inverted_wordles.manage.appendInDeployWordleRow(wordlesAreaSelector, {
            branchName,
            workshopName: questionFile.workshopName,
            question: questionFile.question,
            entries: questionFile.entries,
            lastModifiedTimestamp: questionFile.lastModifiedTimestamp,
            deployStatus: options.deployStatus.inProgress
        });

        // Bind the polling event to update the wordle row when the deploy is ready
        inverted_wordles.manage.bindPolling({
            branchName,
            workshopName: questionFile.workshopName,
            question: questionFile.question,
            entries: questionFile.entries,
            lastModifiedTimestamp: questionFile.lastModifiedTimestamp
        }, options);
    }
};

inverted_wordles.manage.initWordles = function (wordles, options) {
    const generalStatusElm = document.querySelector(options.selectors.status);

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
                inverted_wordles.manage.reportStatus("Error at checking wordle deploy status: " + res.error, generalStatusElm, true);
            });
        } else {
            response.json().then(res => {
                inverted_wordles.manage.renderWordles(wordles, res, options);
                // inverted_wordles.instance.user is set in login_handler.js
                inverted_wordles.manage.setLoginState(inverted_wordles.instance.user ? true : false, options);
                inverted_wordles.manage.bindCreateEvent(options);
                inverted_wordles.manage.bindInputFieldEvents(document, options);
                inverted_wordles.manage.bindDeleteEvents(document, options);
            });
        }
    }, error => {
        error.json().then(err => {
            inverted_wordles.manage.reportStatus("Error at checking wordle deploy status: " + err.error, generalStatusElm, true);
        });
    });
};

inverted_wordles.manage.initManagePage = function (options) {
    fetch("/api/fetch_wordles").then(
        response => {
            inverted_wordles.manage.bindNetlifyEvents(options);
            response.json().then(wordles => {
                inverted_wordles.manage.initWordles(wordles, options);
            });
        },
        error => inverted_wordles.manage.reportStatus("Error at fetching wordles: " + error, document.querySelector(options.selectors.status), true)
    );
};
