"use strict";

/* global inverted_wordles, uuidv4, currentLanguage */

/**
 * Bind event listeners for the "create question" button.
 * @param {Object} options - The value of inverted_wordles.manage.globalOptions.
 */
inverted_wordles.manage.bindCreateEvent = function (options) {
    const createButton = document.querySelector(options.selectors.createButton);
    createButton.addEventListener("click", () => inverted_wordles.manage.createWordle(inverted_wordles.manage.globalOptions));
};

/**
 * Create a word cloud.
 * @param {Object} options - The value of inverted_wordles.manage.globalOptions.
 */
inverted_wordles.manage.createWordle = function (options) {
    const wordleId = uuidv4();
    const lastModifiedTimestamp = new Date().toISOString();

    // create a new word cloud
    const newWordleRow = inverted_wordles.manage.renderWordleRow({
        wordleId,
        workshopName: "",
        question: "",
        entries: 0,
        lastModifiedTimestamp: inverted_wordles.manage.formatDate(lastModifiedTimestamp)
    }, currentLanguage);

    // append the new row to the word cloud list
    // Using insertAdjacentHTML() instead of innerHTML prevents the browser from re-evaluating the entire wordlesArea.
    // It helps to keep value changes and retain event listeners on other row elements.
    // See: https://stackoverflow.com/questions/38945032/append-htmltext-to-element-without-affecting-siblings
    document.querySelector(options.selectors.wordlesArea).insertAdjacentHTML("beforeend", newWordleRow);
};

/**
 * Create a word cloud.
 * @param {Object} options - The value of inverted_wordles.manage.globalOptions.
 */
inverted_wordles.manage.createWordle = function (options) {
    const generalStatusElm = document.querySelector(options.selectors.status);
    const wordleId = uuidv4();

    // create a word cloud question
    fetch("/api/create_question", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            wordleId
        })
    }).then(response => {
        // Javascript fetch function does not reject when the status code is between 400 to 600.
        // This range of status code needs to be handled specifically in the success block.
        // See https://github.com/whatwg/fetch/issues/18
        if (response.status >= 400 && response.status < 600) {
            response.json().then(res => {
                inverted_wordles.manage.reportStatus("<span data-i18n-textcontent=\"error_create_wordle\">" + inverted_wordles.t("error_create_wordle") + "</span>" + res.error.message, generalStatusElm, "error");
            });
        } else {
            response.json().then(res => {
                const lastModifiedTimestamp = inverted_wordles.manage.formatDate(res.lastModifiedTimestamp);

                // Append the new word cloud row to the word cloud list
                const newWordleRow = inverted_wordles.manage.renderWordleRow({
                    wordleId: res.wordleId,
                    workshopName: "",
                    question: "",
                    entries: 0,
                    lastModifiedTimestamp
                }, currentLanguage);

                // append the new row to the word cloud list
                // Using insertAdjacentHTML() instead of innerHTML prevents the browser from re-evaluating the entire wordlesArea.
                // It helps to keep value changes and retain event listeners on other row elements.
                // See: https://stackoverflow.com/questions/38945032/append-htmltext-to-element-without-affecting-siblings
                document.querySelector(options.selectors.wordlesArea).insertAdjacentHTML("beforeend", newWordleRow);

                // Bind events for input elements and buttons on the new word cloud row
                const wordleRow = inverted_wordles.manage.findWordleRowByWordleId(res.wordleId, options);
                inverted_wordles.manage.bindInputFieldEvents(wordleRow, options);
                inverted_wordles.manage.bindDeleteEvents(wordleRow, options);
            });
        }
    }, error => {
        error.json().then(err => {
            inverted_wordles.manage.reportStatus("<span data-i18n-textcontent=\"error_create_wordle\">" + inverted_wordles.t("error_create_wordle") + "</span>" + err.error, generalStatusElm, "error");
        });
    });
};
