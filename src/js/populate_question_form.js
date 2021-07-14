"use strict";

/* global wordle_globals */

var inverted_wordles = {};

// Populate the data on the answer question page
inverted_wordles.setFormData = function (response, options) {
    response.json().then(questionFile => {
        inverted_wordles.setEscapedContent(options.selectors.questionTitle, questionFile.title);
        inverted_wordles.setEscapedContent(options.selectors.entryMaxLength, questionFile.entryMaxLength);

        let entriesHtml = "";
        for (let i = 0; i < questionFile.entries; i++) {
            entriesHtml += "<input type=\"text\" autocomplete=\"false\" ";
            if (i === 0) {
                entriesHtml += "autofocus";
            }
            entriesHtml += " name=\"answer\" maxlength=\"" + questionFile.entryMaxLength + "\" placeholder=\"Enter a word or a phase\">";
        }

        document.querySelector(options.selectors.entryArea).innerHTML = entriesHtml;
    });
};

inverted_wordles.setEscapedContent = function (selector, content) {
    const escapeHTML = function (html) {
        let escape = document.createElement("textarea");
        escape.textContent = html;
        return escape.innerHTML;
    };

    document.querySelectorAll(selector).forEach(elm => {
        elm.innerHTML = escapeHTML(content);
    });
};

inverted_wordles.reportError = function (error, statusSelector) {
    const statusElm = document.querySelector(statusSelector);
    statusElm.className = "red";
    statusElm.innerHTML = "There is a problem at populating the page data. Please try again later.";
};

inverted_wordles.populateForm = function (options) {
    fetch("/api/fetch_question/" + wordle_globals.branch).then(
        response => inverted_wordles.setFormData(response, options),
        error => inverted_wordles.reportError(error, options.selectors.status)
    );
};
