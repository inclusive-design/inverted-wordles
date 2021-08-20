"use strict";

/* global netlifyIdentity */

var inverted_wordles = {};
const netlifyUrlSuffix = "--inverted-wordles.netlify.app/";

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
            <div class="one-status"></div>
            <input type="hidden" name="branchName" value="${ branchName }">
        </div>\n\n`;
    }
    document.querySelector(wordlesAreaSelector).innerHTML = wordlesHtml;
};

inverted_wordles.setLoginState = function (isLoggedIn, deleteButtonClass, createButtonClass, inputFieldNames) {
    // disable all input elements
    const inputElements = document.getElementsByTagName("input");
    for (let i = 0; i < inputElements.length; i++) {
        if (inputFieldNames.includes(inputElements[i].getAttribute("name"))) {
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
    netlifyIdentity.on("login", () => inverted_wordles.setLoginState(true, options.selectors.deleteButtonClass, options.selectors.createButtonClass, options.inputFieldNames));
    netlifyIdentity.on("logout", () => inverted_wordles.setLoginState(false, options.selectors.deleteButtonClass, options.selectors.createButtonClass, options.inputFieldNames));
};

// Bind onChange events for all input fields that users will change values
inverted_wordles.bindInputFieldEvents = function (options) {
    const inputElements = document.getElementsByTagName("input");
    for (let i = 0; i < inputElements.length; i++) {
        const currentInput = inputElements[i];
        if (options.inputFieldNames.includes(currentInput.getAttribute("name"))) {
            currentInput.addEventListener("change", evt => {
                let dataTogo = {}, branchName, oneStatusElm;
                // find the branch name value and the status element for the current wordle
                currentInput.parentElement.parentElement.childNodes.forEach(elm => {
                    if (elm.name === options.branchNameField) {
                        branchName = elm.value;
                    }
                    if (elm.className && elm.className.includes(options.oneStatusClassName)) {
                        oneStatusElm = elm;
                    }
                });
                dataTogo[evt.target.name] = evt.target.value;
                dataTogo.branchName = branchName;

                fetch("/api/save_question", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataTogo)
                }).then(
                    response => {
                        // Javascript fetch function does not reject when the status code is between 400 to 600.
                        // This range of status code needs to be handled specifically in the success block.
                        // See https://github.com/whatwg/fetch/issues/18
                        if (response.status >= 400 && response.status < 600) {
                            response.json().then(res => {
                                inverted_wordles.reportStatus("*New edits FAILED. Error: " + res.message + "*", oneStatusElm, true);
                            });
                        } else {
                            inverted_wordles.reportStatus("*New edits SUCCESSFUL*", oneStatusElm, false);
                        }
                    },
                    error => {
                        error.json().then(err => {
                            inverted_wordles.reportStatus("*New edits FAILED. Error: " + err.error + "*", oneStatusElm, true);
                        });
                    }
                );
            });
        }
    }
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

inverted_wordles.reportStatus = function (message, statusElm, isError) {
    statusElm.style.display = "block";
    statusElm.classList.remove("red");
    statusElm.classList.remove("green");
    statusElm.classList.add(isError ? "red" : "green");
    statusElm.innerHTML = message;
};

// Populate the data on the answer question page
inverted_wordles.initPage = function (response, options) {
    inverted_wordles.bindNetlifyEvents(options);
    response.json().then(wordles => {
        inverted_wordles.listWordles(wordles, options.selectors.wordlesArea);
        inverted_wordles.bindInputFieldEvents(options);
    });
};

inverted_wordles.initWordles = function (options) {
    fetch("/api/fetch_wordles").then(
        response => inverted_wordles.initPage(response, options),
        error => inverted_wordles.reportStatus("Error at listing all wordles: " + error, document.querySelector(options.selectors.status), true)
    );
};
