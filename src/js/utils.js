// Shared utility functions

"use strict";

/*
 * Convert a date into the format of "Month day, Year".
 * @param {String} inputDate - A string of date.
 * @return The string in the format of "Month day, Year".
 */
// eslint-disable-next-line
const convertDate = function (inputDate) {
    const dateObject = new Date(inputDate);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return `${months[dateObject.getMonth()]} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;
};

/*
 * Replace special characters in the input string to understandable characters.
 * @param {String} str - The input string to have special characters replaced.
 * @return A string with all special characters replaced.
 */
// eslint-disable-next-line
const slugify = function (str) {
    const from = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
    const to = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
    const p = new RegExp(from.split("").join("|"), "g");

    // 1. Replace spaces with -
    // 2. Replace special characters
    return str.toString().toLowerCase().replace(/\s+/g, "-").replace(p, c => to.charAt(from.indexOf(c)));
};
