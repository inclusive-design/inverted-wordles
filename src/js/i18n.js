"use strict";

/* global inverted_wordles */

const supportedLanguages = ["en", "fr"];
const defaultLanguage = "en";

const currentBrowserLang = navigator.language.split("-")[0];

const urlSearchParams = new URLSearchParams(window.location.search);
const userSelectedLang = urlSearchParams.get("lang");

// Global variable to keep track of the current language code
let currentLanguage = userSelectedLang ? userSelectedLang :
    supportedLanguages.includes(currentBrowserLang) ? currentBrowserLang : defaultLanguage;

// Global variable to keep track of the translation object
let translations = inverted_wordles.languages[currentLanguage] || inverted_wordles.languages.en;

// Translate function
// Note: this function is dependent on a global variable `translations` that contains translated
// phrases for the current language.
inverted_wordles.t = function (key) {
    return translations[key] || `[Missing translation for ${key}]`;
};

document.addEventListener("DOMContentLoaded", function () {
    // Update dynamic contents with the proper language translations.
    // Note: this function depends on a properly-set global variable `translations`.
    // These special attributes with prefix `data-i18n-` are attached onto
    // those html elements whose contents need to be updated according to
    // the current selected language.
    // data-i18n-textcontent: update `textContent`
    // data-i18n-placeholder: update the value of the `placeholder` attribute
    // data-i18n-link: use for <a> links that lead to other pages. Their `href`
    //     URL needs to be updated by updating `lang=currentLanguage` in search
    //     parameters.
    inverted_wordles.updateI18nContent = function () {
        // find all elements with an attribute prefixed with "data-i18n-"
        const translatableElements = document.querySelectorAll("[data-i18n-textcontent], [data-i18n-placeholder], [data-i18n-link]");

        translatableElements.forEach(el => {
            const key = el.dataset.i18nTextcontent || el.dataset.i18nPlaceholder;
            const newly_translated = inverted_wordles.t(key);

            if (el.dataset.i18nTextcontent) {
                el.textContent = newly_translated;
            } else if (el.dataset.i18nPlaceholder) {
                el.placeholder = newly_translated;
            } else if (el.dataset.i18nLink === "") {
                // Note: as there isn't a value assigned to `data-i18n-link` attribute,
                // check its value === "" is required in order to have the check return true.
                const url = new URL(el.href);
                url.searchParams.set("lang", currentLanguage);
                el.href = url.toString();
            }
        });
    };

    // Toggle language
    const toggleEnButton = document.getElementById("toggle-en");
    const toggleFrButton = document.getElementById("toggle-fr");

    // Style the language toggle buttons
    inverted_wordles.styleToggleButtons = function (lang) {
        toggleEnButton.classList.toggle("active", lang === "en");
        toggleFrButton.classList.toggle("active", lang === "fr");
    };

    inverted_wordles.toggleLanguage = function (newLang) {
        // Update the global variable currentLanguage
        currentLanguage = newLang;

        // Load the translations for the new language
        translations = inverted_wordles.languages[currentLanguage] || inverted_wordles.languages.en;
        inverted_wordles.updateI18nContent();

        // Update the URL
        const url = new URL(window.location);
        url.searchParams.set("lang", currentLanguage);
        window.history.pushState({}, "", url.toString());

        // Style language toggle buttons
        inverted_wordles.styleToggleButtons(newLang);
    };

    toggleEnButton.addEventListener("click", () => inverted_wordles.toggleLanguage("en"));
    toggleFrButton.addEventListener("click", () => inverted_wordles.toggleLanguage("fr"));

    // Initial actions at the page load:
    // 1. translation;
    // 2. style language toggle buttons
    if (currentLanguage !== defaultLanguage) {
        inverted_wordles.updateI18nContent();
        inverted_wordles.styleToggleButtons(currentLanguage);
    }
});
