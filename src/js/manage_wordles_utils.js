"use strict";

var inverted_wordles = {};

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
