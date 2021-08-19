"use strict";

/* global netlifyIdentity */

var inverted_wordles = {};
const netlifyUrlSuffix = "--inverted-wordles.netlify.app/";
const initialDisabledInputNames = ["workshop-name", "question", "entries"];

inverted_wordles.listWordles = function (wordles, wordlesAreaSelector) {
    let wordlesHtml = document.querySelector(wordlesAreaSelector).innerHTML;
    for (const [branchName, questionFile] of Object.entries(wordles)) {
        const workshopName = questionFile.exists && questionFile.content.workshopName ? inverted_wordles.escapeHtml(questionFile.content.workshopName) : "";
        const question = questionFile.exists && questionFile.content.question ? inverted_wordles.escapeHtml(questionFile.content.question) : "";
        const entries = questionFile.exists && questionFile.content.entries ? questionFile.content.entries : "";
        const lastModifiedTimestamp = questionFile.exists && questionFile.content.lastModifiedTimestamp ? questionFile.content.lastModifiedTimestamp.substring(0, 10).replace(/-/g, "/") : "";
        const uniqueId = Date.now();

        wordlesHtml += `
        <div class="one-wordle">
            <div class="workshop-name-cell">
                <label for="workshop-name-id-${ uniqueId }">Workshop Name</label>
                <input type="text" id="workshop-name-id-${ uniqueId }" name="workshop-name" value="${ workshopName }">
            </div>
            <div class="question-cell">
                <label for="question-id-${ uniqueId }">Question</label>
                <input type="text" id="question-id-${ uniqueId }" name="question" value="${ question }">
            </div>
            <div class="entries-cell">
                <label for="entries-id-${ uniqueId }">Word Entries</label>
                <input type="text" id="entries-id-${ uniqueId }" name="entries" value="${ entries }">
            </div>
            <div class="view-answer-cell">
                <label for="view-answer-id-${ uniqueId }">Answers</label>
                <a id="view-answer-id-${ uniqueId }" class="button view-answer" href="https://${ branchName + netlifyUrlSuffix }answer/">
                    <svg role="presentation" class="view-answer-svg">
                        <use xlink:href="#view"></use>
                    </svg>
                    View
                </a>
            </div>
            <div class="view-wordle-cell">
                <label for="view-wordle-id-${ uniqueId }">Wordle</label>
                <a id="view-wordle-id-${ uniqueId }" class="button view-wordle" href="https://${ branchName + netlifyUrlSuffix }wordle/">
                    <svg role="presentation" class="view-wordle-svg">
                        <use xlink:href="#view"></use>
                    </svg>
                    View
                </a>
            </div>
            <div class="last-modified-cell">
                <label for="view-wordle-id-${ uniqueId }">Last Modified</label>
                <span id="view-wordle-id-${ uniqueId }">${ lastModifiedTimestamp }</span>
            </div>
            <div class="delete-cell">
                <button class="delete-button">
                    <svg role="presentation" class="view-answer-svg">
                        <use xlink:href="#delete"></use>
                    </svg>
                    Delete
                </button>
            </div>
            <div class="one-status">failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed failed </div>
            <input type="hidden" name="branchName" value="${ branchName }">
        </div>\n\n`;
    }
    document.querySelector(wordlesAreaSelector).innerHTML = wordlesHtml;
};

inverted_wordles.setLoginState = function (isLoggedIn, deleteButtonClass, createButtonClass) {
    // disable all input elements
    const inputElements = document.getElementsByTagName("input");
    for (let i = 0; i < inputElements.length; i++) {
        if (initialDisabledInputNames.includes(inputElements[i].getAttribute("name"))) {
            if (isLoggedIn) {
                inputElements[i].removeAttribute("disabled");
            } else {
                inputElements[i].setAttribute("disabled", "disabled");
            }
        }
    }

    // disable delete buttons
    const deleteButtons = document.querySelectorAll(deleteButtonClass);
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].disabled = isLoggedIn ? false : true;
    }

    // hide create new question button
    document.querySelector(createButtonClass).style.visibility = isLoggedIn ? "visible" : "hidden";
};

inverted_wordles.bindNetlifyEvents = function (options) {
    netlifyIdentity.on("login", () => {
        // enable input fields and buttons
        inverted_wordles.setLoginState(true, options.selectors.deleteButtonClass, options.selectors.createButtonClass);
    });

    netlifyIdentity.on("logout", () => {
        // disable input fields and buttons
        inverted_wordles.setLoginState(false, options.selectors.deleteButtonClass, options.selectors.createButtonClass);
    });
};

// Escape html special characters
// Reference: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript#answer-6234804
inverted_wordles.escapeHtml = function (content) {
    return content.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

inverted_wordles.reportError = function (error, statusSelector) {
    const statusElm = document.querySelector(statusSelector);
    statusElm.innerHTML = "Error at populating the page data: " + error;
};

// Populate the data on the answer question page
inverted_wordles.initPage = function (response, options) {
    inverted_wordles.bindNetlifyEvents(options);
    response.json().then(wordles => {
        inverted_wordles.listWordles(wordles, options.selectors.wordlesArea);
    });
};

inverted_wordles.initWordles = function (options) {
    fetch("/api/fetch_wordles").then(
        response => inverted_wordles.initPage(response, options),
        error => inverted_wordles.reportError(error, options.selectors.status)
    );
};
