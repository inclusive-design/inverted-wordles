"use strict";

/* global netlifyIdentity, inverted_wordles */
inverted_wordles.instance = {};

document.addEventListener("DOMContentLoaded", () => {
    inverted_wordles.instance.user = netlifyIdentity.currentUser();
});

inverted_wordles.setLoginState = function (isLoggedIn, options) {
    const deployStatusElements = document.querySelector("input[name='" + options.deployStatusField + "']");
    for (let i = 0; i < deployStatusElements.length; i++) {
        const currentDeployStatus = deployStatusElements[i].value;
        const enabled = isLoggedIn && currentDeployStatus === options.deployStatus.ready;

        // For wordles that have been deployed, enable their input fields and delete button. Otherwise, disable them.
        const parentContainer = deployStatusElements[i].parentElement;
        const inputElements = parentContainer.getElementsByTagName("input");
        for (let i = 0; i < inputElements.length; i++) {
            if (options.inputFieldNames.includes(inputElements[i].getAttribute("name"))) {
                if (enabled) {
                    inputElements[i].removeAttribute("disabled");
                } else {
                    inputElements[i].setAttribute("disabled", "disabled");
                }
            }
        }

        parentContainer.querySelector(options.selectors.deleteButton).disabled = enabled ? false : true;
    }

    // Show or hide create new question button
    document.querySelector(options.selectors.createButton).style.display = isLoggedIn ? "block" : "none";
};

inverted_wordles.bindNetlifyEvents = function (options) {
    netlifyIdentity.on("login", () => inverted_wordles.setLoginState(true, options));
    netlifyIdentity.on("logout", () => inverted_wordles.setLoginState(false, options));
};
