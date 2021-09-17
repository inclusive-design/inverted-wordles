"use strict";

/* global netlifyIdentity, globalOptions, inverted_wordles */

document.addEventListener("DOMContentLoaded", () => {
    globalOptions.user = netlifyIdentity.currentUser();
});

inverted_wordles.setLoginState = function (isLoggedIn) {
    const deployStatusElements = document.querySelector("input[name='" + globalOptions.deployStatusField + "']");
    for (let i = 0; i < deployStatusElements.length; i++) {
        const currentDeployStatus = deployStatusElements[i].value;
        const enabled = isLoggedIn && currentDeployStatus === globalOptions.deployStatus.ready;

        // For wordles that have been deployed, enable their input fields and delete button. Otherwise, disable them.
        const parentContainer = deployStatusElements[i].parentElement;
        const inputElements = parentContainer.getElementsByTagName("input");
        for (let i = 0; i < inputElements.length; i++) {
            if (globalOptions.inputFieldNames.includes(inputElements[i].getAttribute("name"))) {
                if (enabled) {
                    inputElements[i].removeAttribute("disabled");
                } else {
                    inputElements[i].setAttribute("disabled", "disabled");
                }
            }
        }

        parentContainer.querySelector(globalOptions.selectors.deleteButton).disabled = enabled ? false : true;
    }

    // Show or hide create new question button
    document.querySelector(globalOptions.selectors.createButton).style.display = isLoggedIn ? "block" : "none";
};

inverted_wordles.bindNetlifyEvents = function () {
    netlifyIdentity.on("login", () => inverted_wordles.setLoginState(true));
    netlifyIdentity.on("logout", () => inverted_wordles.setLoginState(false));
};
