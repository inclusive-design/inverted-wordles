/* global inverted_wordles, uuidv4 */

"use strict";

/**
 * Escape html special characters.
 * See: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript#answer-6234804
 * @param {String} content - A html content to be escaped.
 * @return {String} Escaped content.
 */
inverted_wordles.manage.escapeHtml = function (content) {
    return content.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

/**
 * Format a timestamp from ""2021-10-15T14:22:06.528Z"" to ""2021-10-15".
 * @param {String} fromDate - A date in the from format.
 * @return {String} Formatted date.
 */
inverted_wordles.manage.formatDate = function (fromDate) {
    return fromDate ? fromDate.substring(0, 10).replace(/-/g, "/") : "";
};

/**
 * Show a message in a status element.
 * @param {String} message - A message to show.
 * @param {DOMElement} statusElm - The status DOM element.
 * @param {String} messageType - Accept three types: error, success, info.
 */
inverted_wordles.manage.reportStatus = function (message, statusElm, messageType) {
    statusElm.style.display = "block";
    statusElm.classList.remove("error");
    statusElm.classList.remove("success");
    statusElm.classList.add(messageType);
    statusElm.innerHTML = message;
};

/**
 * An object that contains required values to render a wordle row.
 * @typedef {Object} wordleOptions
 * @param {String} wordleId - The wordle Id.
 * @param {String} workshopName - The workshop name.
 * @param {String} question - The question.
 * @param {Number} entries - A number of entries for a question.
 * @param {String} lastModifiedTimestamp - The last modified timestamp.
 */

/**
 * Return html of a wordle record on the landing page.
 * @param {wordleOptions} wordleOptions - Values required to render a wordle row.
 * @param {String} currentLanguage - The current language code.
 * @return {String} A html string mapping to a wordle record on the landing page.
 */
inverted_wordles.manage.renderWordleRow = function (wordleOptions, currentLanguage) {
    const uniqueId = uuidv4();

    return `
    <div id="one-wordle-id-${ uniqueId }" class="one-wordle">
        <div class="workshop-name-cell">
            <input type="text" id="workshop-name-id-${ uniqueId }" aria-labelledby="workshop-name-label" name="workshop-name" value="${ inverted_wordles.manage.escapeHtml(wordleOptions.workshopName) }">
        </div>
        <div class="question-cell">
            <input type="text" id="question-id-${ uniqueId }" aria-labelledby="question-label" name="question" value="${ inverted_wordles.manage.escapeHtml(wordleOptions.question) }">
        </div>
        <div class="entries-cell">
            <input type="text" id="entries-id-${ uniqueId }" aria-labelledby="entries-label" name="entries" value="${ wordleOptions.entries }">
        </div>
        <div class="view-answer-cell">
            <a id="view-answer-id-${ uniqueId }" class="button view-answer" href="/answer/?id=${ wordleOptions.wordleId}&lang=${ currentLanguage }" 
                data-i18n-link aria-labelledby="view-answer-label-${ uniqueId }">
                <svg role="presentation" class="view-answer-svg">
                    <use xlink:href="#view"></use>
                </svg>
                <span data-i18n-textcontent="view" data-i18n-textcontent="view">${ inverted_wordles.t("view") }</span>
            </a>
            <label class="visually-hidden" id="view-answer-label-${ uniqueId }">
                <span data-i18n-textcontent="view_answers_page">${ inverted_wordles.t("view_answers_page") }</span> "<span class="question-id-${ uniqueId }-label">${ inverted_wordles.manage.escapeHtml(wordleOptions.question) }</span>" <span data-i18n-textcontent="from_workshop">${ inverted_wordles.t("from_workshop") }</span> "<span class="workshop-name-id-${ uniqueId }-label">${ inverted_wordles.manage.escapeHtml(wordleOptions.workshopName) }</span>"
            </label>
        </div>
        <div class="view-wordle-cell">
            <a id="view-wordle-id-${ uniqueId }" class="button view-wordle" href="/wordle/?id=${ wordleOptions.wordleId}&lang=${ currentLanguage }" 
                data-i18n-link aria-labelledby="view-wordle-label-${ uniqueId }">
                <svg role="presentation" class="view-wordle-svg">
                    <use xlink:href="#view"></use>
                </svg>
                <span data-i18n-textcontent="view" data-i18n-textcontent="view">${ inverted_wordles.t("view") }</span>
            </a>
            <label class="visually-hidden" id="view-wordle-label-${ uniqueId }">
                <span data-i18n-textcontent="view_wordle_page">${ inverted_wordles.t("view_wordle_page") }</span> "<span class="question-id-${ uniqueId }-label">${ inverted_wordles.manage.escapeHtml(wordleOptions.question) }</span>" <span data-i18n-textcontent="from_workshop">${ inverted_wordles.t("from_workshop") }</span> "<span class="workshop-name-id-${ uniqueId }-label">${ inverted_wordles.manage.escapeHtml(wordleOptions.workshopName) }</span>"
            </label>
        </div>
        <div class="last-modified-cell">
            <span id="last-modified-id-${ uniqueId }" aria-labelledby="last-modified-label">${ inverted_wordles.manage.formatDate(wordleOptions.lastModifiedTimestamp) }</span>
        </div>
        <div class="delete-cell">
            <button id="delete-id-${ uniqueId }" class="delete-button" aria-labelledby="delete-label-${ uniqueId }">
                <svg role="presentation" class="view-answer-svg">
                    <use xlink:href="#cross"></use>
                </svg>
                <span data-i18n-textcontent="delete">${ inverted_wordles.t("delete") }</span>
            </button>
            <label class="visually-hidden" id="delete-label-${ uniqueId }">
                <span data-i18n-textcontent="wordle_with_question">${ inverted_wordles.t("delete_wordle_with_question") }</span> "<span class="question-id-${ uniqueId }-label">${ inverted_wordles.manage.escapeHtml(wordleOptions.question) }</span>" <span data-i18n-textcontent="from_workshop">${ inverted_wordles.t("from_workshop") }</span> "<span class="workshop-name-id-${ uniqueId }-label">${ inverted_wordles.manage.escapeHtml(wordleOptions.workshopName) }</span>"
            </label>
        </div>
        <div class="one-status" role="status"></div>
        <input type="hidden" name="wordleId" value="${ wordleOptions.wordleId }">
    </div>\n\n`;
};

/**
 * Find the wordle row on the wordle list based on the given wordle id.
 * @param {String} wordleId - The wordle ID.
 * @param {String} options - The value of inverted_wordles.manage.globalOptions.
 * @return {DOMElement} The DOM element of a wordle row.
 */
inverted_wordles.manage.findWordleRowByWordleId = function (wordleId, options) {
    const wordlesListElm = document.querySelector(options.selectors.wordlesArea);
    // On the wordle list, find the row with the same wordle id
    const wordleIdElm = wordlesListElm.querySelector("input[name=\"" + options.wordleIdField + "\"][value=\"" + wordleId + "\"]");
    // Return the wordle row element
    return wordleIdElm.parentElement;
};

/**
 * Compute the to-name that shares the same suffix with the from-name.
 * @param {String} nameFrom - The from-name composing of the from-prefix and the suffix.
 * @param {String} prefixFrom - The prefix of the from-name.
 * @param {String} prefixTo - The prefix of the to-name.
 * @return {String} The to-name that shares the same suffix with the from-name.
 */
inverted_wordles.manage.getNameWithSharedSuffix = function (nameFrom, prefixFrom, prefixTo) {
    return prefixTo + nameFrom.substring(prefixFrom.length);
};
