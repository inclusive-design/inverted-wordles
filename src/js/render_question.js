"use strict";

/* global wordle_globals, inverted_wordles */

// Populate the data on the answer question page
inverted_wordles.setFormData = function (response, options) {
    // Set the view wordle link
    document.querySelector(options.selectors.viewWordle).href = "/wordle/?id=" + wordle_globals.wordleId;

    response.json().then(questionFile => {
        inverted_wordles.setEscapedContent(options.selectors.question, questionFile.question);
        inverted_wordles.setEscapedContent(options.selectors.entryMaxLength, questionFile.entryMaxLength);

        // Refer to https://stackoverflow.com/questions/30452263/is-there-a-mechanism-to-loop-x-times-in-es6-ecmascript-6-without-mutable-varia#answer-37417004
        // for iterating a given number of times.
        let entriesHtml = [...Array(questionFile.entries)].map((_, i) => {
            return `
            <div class="answer_row">
                <label for="answer_${ i }"><span data-i18n-textcontent="answer">${ inverted_wordles.t("answer") }</span> ${ i + 1 } </label>
                <input type="text" autocomplete="false" ${ i === 0 ? "autofocus" : "" } name="answer" id="answer_${ i }" maxlength="${questionFile.entryMaxLength}" placeholder="${ inverted_wordles.t("enter_an_answer") }" data-i18n-placeholder="enter_an_answer">
            </div>
            `;
        });
        document.querySelector(options.selectors.entryArea).innerHTML = entriesHtml.join("\n");
    });
};

inverted_wordles.setEscapedContent = function (selector, content) {
    document.querySelectorAll(selector).forEach(elm => {
        elm.textContent = content;
    });
};

inverted_wordles.reportError = function (error, statusSelector) {
    const statusElm = document.querySelector(statusSelector);
    statusElm.className = "error";
    statusElm.innerHTML = "<span data-i18n-textcontent=\"error_load_data\">" + inverted_wordles.t("error_load_data") + "</span>" + error;
};

inverted_wordles.populateForm = function (options) {
    fetch("/api/fetch_question/" + wordle_globals.wordleId).then(
        response => inverted_wordles.setFormData(response, options),
        error => inverted_wordles.reportError(error, options.selectors.status)
    );
};
