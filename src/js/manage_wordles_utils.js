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
 * @return {String} A html string mapping to a wordle record on the landing page.
 */
inverted_wordles.manage.renderWordleRow = function (wordleOptions) {
    const uniqueId = uuidv4();

    return `
    <div id="one-wordle-id-${ uniqueId }" class="one-wordle">
        <div class="workshop-name-cell">
            <label for="workshop-name-id-${ uniqueId }">Workshop Name</label>
            <input type="text" id="workshop-name-id-${ uniqueId }" name="workshop-name" value="${ inverted_wordles.manage.escapeHtml(wordleOptions.workshopName) }">
        </div>
        <div class="question-cell">
            <label for="question-id-${ uniqueId }">Question</label>
            <input type="text" id="question-id-${ uniqueId }" name="question" value="${ inverted_wordles.manage.escapeHtml(wordleOptions.question) }">
        </div>
        <div class="entries-cell">
            <label for="entries-id-${ uniqueId }">Word Entries</label>
            <input type="text" id="entries-id-${ uniqueId }" name="entries" value="${ wordleOptions.entries }">
        </div>
        <div class="view-answer-cell">
            <label for="view-answer-id-${ uniqueId }">Answers</label>
            <a id="view-answer-id-${ uniqueId }" class="button view-answer" href="${ inverted_wordles.instance.netlifyUrlDomain }answer/?id=${ wordleOptions.wordleId}">
                <svg role="presentation" class="view-answer-svg">
                    <use xlink:href="#view"></use>
                </svg>
                View
            </a>
        </div>
        <div class="view-wordle-cell">
            <label for="view-wordle-id-${ uniqueId }">Wordle</label>
            <a id="view-wordle-id-${ uniqueId }" class="button view-wordle" href="${ inverted_wordles.instance.netlifyUrlDomain }wordle/?id=${ wordleOptions.wordleId}">
                <svg role="presentation" class="view-wordle-svg">
                    <use xlink:href="#view"></use>
                </svg>
                View
            </a>
        </div>
        <div class="last-modified-cell">
            <label for="last-modified-id-${ uniqueId }">Last Modified</label>
            <span id="last-modified-id-${ uniqueId }">${ inverted_wordles.manage.formatDate(wordleOptions.lastModifiedTimestamp) }</span>
        </div>
        <div class="delete-cell">
            <button id="delete-id-${ uniqueId }" class="delete-button">
                <svg role="presentation" class="view-answer-svg">
                    <use xlink:href="#cross"></use>
                </svg>
                Delete
            </button>
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
