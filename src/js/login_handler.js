"use strict";

/* global netlifyIdentity, inverted_wordles */
inverted_wordles.instance = {};

/**
 * Check if a netlify user is logged in at the page load.
 */
document.addEventListener("DOMContentLoaded", () => {
    inverted_wordles.instance.user = netlifyIdentity.currentUser();
});

inverted_wordles.manage.setLoginState = function (isLoggedIn, options) {
    const wordlesArea = document.querySelector(options.selectors.wordlesArea);

    // Enable/Disable input text fields
    const inputElements = wordlesArea.querySelectorAll("input");
    inputElements.forEach(inputElm => options.inputFieldNames.includes(inputElm.getAttribute("name")) && isLoggedIn ?
        inputElm.removeAttribute("disabled") :
        inputElm.setAttribute("disabled", "disabled")
    );

    // Enable/Disable delete buttons
    const delButtons = wordlesArea.querySelectorAll(options.selectors.deleteButton);
    delButtons.forEach(delButton => delButton.disabled = !isLoggedIn);

    // Show or hide create new question button
    document.querySelector(options.selectors.createButton).style.display = isLoggedIn ? "block" : "none";
};

/**
 * Bind netlify events to respond to user login and logout.
 * @param {Object} options - The value of inverted_wordles.manage.globalOptions.
 */
inverted_wordles.manage.bindNetlifyEvents = function (options) {
    netlifyIdentity.on("login", () => inverted_wordles.manage.setLoginState(true, options));
    netlifyIdentity.on("logout", () => inverted_wordles.manage.setLoginState(false, options));
};
