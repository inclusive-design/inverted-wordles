"use strict";

const netlifyUrlSuffix = "--inverted-wordles.netlify.app/";
const initialDisabledInputNames = ["workshop-name", "question", "entries"];
var inverted_wordles = {};

inverted_wordles.listWordles = function (wordles, wordlesAreaSelector) {
    let wordlesHtml = document.querySelector(wordlesAreaSelector).innerHTML;
    for (const [branchName, questionFile] of Object.entries(wordles)) {
        const workshopName = questionFile.exists && questionFile.content.workshopName ? inverted_wordles.escapeHtml(questionFile.content.workshopName) : "";
        const question = questionFile.exists && questionFile.content.question ? inverted_wordles.escapeHtml(questionFile.content.question) : "";
        const entries = questionFile.exists && questionFile.content.entries ? questionFile.content.entries : "";
        const lastModifiedTimestamp = questionFile.exists && questionFile.content.lastModifiedTimestamp ? questionFile.content.lastModifiedTimestamp.substring(0, 10).replace(/-/g, "/") : "";
        const uniqueId = Date.now();

        wordlesHtml += `
        <tr>
            <td class="workshop-name-cell">
                <label for="workshop-name-id-${ uniqueId }">Workshop Name</label>
                <input type="text" id="workshop-name-id-${ uniqueId }" name="workshop-name" value="${ workshopName }">
            </td>
            <td class="question-cell">
                <label for="question-id-${ uniqueId }">Question</label>
                <input type="text" id="question-id-${ uniqueId }" name="question" value="${ question }">
            </td>
            <td class="entries-cell">
                <label for="entries-id-${ uniqueId }">Word Entries</label>
                <input type="text" id="entries-id-${ uniqueId }" name="entries" value="${ entries }">
            </td>
            <td class="answer-cell">
                <label for="view-answer-id-${ uniqueId }">Answers</label>
                <a id="view-answer-id-${ uniqueId }" class="button view-answer" href="https://${ branchName + netlifyUrlSuffix }answer/">
                    <svg role="presentation" class="view-answer-svg">
                        <use xlink:href="#view"></use>
                    </svg>
                    View
                </a>
            </td>
            <td class="wordle-cell">
                <label for="view-wordle-id-${ uniqueId }">Wordle</label>
                <a id="view-wordle-id-${ uniqueId }" class="button view-wordle" href="https://${ branchName + netlifyUrlSuffix }wordle/">
                    <svg role="presentation" class="view-wordle-svg">
                        <use xlink:href="#view"></use>
                    </svg>
                    View
                </a>
            </td>
            <td class="last-modified-cell">
                <label for="view-wordle-id-${ uniqueId }">Last Modified</label>
                <span id="view-wordle-id-${ uniqueId }">${ lastModifiedTimestamp }</span>
            </td>
            <td class="delete-cell">
                <button class="delete-button">
                    <svg role="presentation" class="view-answer-svg">
                        <use xlink:href="#delete"></use>
                    </svg>
                    Delete
                </button>
            </td>
            <input type="hidden" name="branchName" value="${ branchName }">
        </tr>\n\n`;
    }
    document.querySelector(wordlesAreaSelector).innerHTML = wordlesHtml;
};

inverted_wordles.setInitState = function () {
    // disable all input elements
    const inputElements = document.getElementsByTagName("input");
    for (let i = 0; i < inputElements.length; i++) {
        if (initialDisabledInputNames.includes(inputElements[i].getAttribute("name"))) {
            inputElements[i].setAttribute("disabled", "disabled");
        }
    }

    // disable delete buttons
    const deleteButtons = document.querySelectorAll(".delete-button");
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].disabled = true;
    }
};

// Populate the data on the answer question page
inverted_wordles.initPage = function (response, options) {
    response.json().then(wordles => {
        inverted_wordles.listWordles(wordles, options.selectors.wordlesArea);
        inverted_wordles.setInitState();
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

inverted_wordles.populateWordles = function (options) {
    fetch("/api/fetch_wordles").then(
        response => inverted_wordles.initPage(response, options),
        error => inverted_wordles.reportError(error, options.selectors.status)
    );
};
