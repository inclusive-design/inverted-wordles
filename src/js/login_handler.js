"use strict";

/* global netlifyIdentity, globalOptions, inverted_wordles */

inverted_wordles.setLoginState = function (isLoggedIn) {
    // disable all input elements
    const inputElements = document.getElementsByTagName("input");
    for (let i = 0; i < inputElements.length; i++) {
        if (globalOptions.inputFieldNames.includes(inputElements[i].getAttribute("name"))) {
            if (isLoggedIn) {
                inputElements[i].removeAttribute("disabled");
            } else {
                inputElements[i].setAttribute("disabled", "disabled");
            }
        }
    }

    // disable delete buttons
    const deleteButtons = document.querySelectorAll(globalOptions.selectors.deleteButton);
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].disabled = isLoggedIn ? false : true;
    }

    // hide create new question button
    document.querySelector(globalOptions.selectors.createButton).style.visibility = isLoggedIn ? "visible" : "hidden";
};

inverted_wordles.bindNetlifyEvents = function () {
    netlifyIdentity.on("login", () => inverted_wordles.setLoginState(true));
    netlifyIdentity.on("logout", () => inverted_wordles.setLoginState(false));
};
