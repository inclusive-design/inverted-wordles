"use strict";

/* global d3, wordle_globals */

var inverted_wordles = {};

inverted_wordles.stringTemplateRegex = /\${([^\}]*)}/g;

/** Perform string templating by interpolation of terms expressed as "${term1} ... text ... ${term2}" etc. supplied as a
 * hash, in a function similar to that supplied at the language level by ES6 templating
 * @param {String} template - The template to be interpolated
 * @param {Object} terms - The hash of terms to be interpolated into the template
 * @return {String} The interpolated template
 */
inverted_wordles.stringTemplate = function (template, terms) {
    var replacer = function (all, match) {
        return terms[match] || "";
    };
    return template.replace(inverted_wordles.stringTemplateRegex, replacer);
};

/** Given the contents of the answers.json file from github, construct a hash of answer words to their frequencies
 * @param {Object} answersFile - Contents of the answers file as JSON
 * @return {Count[]} An array of {word, count}
 */
inverted_wordles.extractAnswers = function (answersFile) {
    var counts = {};
    var storeAnswer = function (answer) {
        counts[answer] = counts[answer] ? counts[answer] + 1 : 1;
    };
    Object.values(answersFile).forEach(function (oneAnswerRec) {
        oneAnswerRec.answers.forEach(function (answer) {
            answer.split(" ").forEach(storeAnswer);
        });
    });
    return Object.entries(counts).map(function (entry) {
        return {
            word: entry[0],
            count: entry[1]
        };
    });
};

/** Render the layout constructed from makeLayout into the DOM element designated in the supplied Wordle instance
 * @param {d3Layout} layout - The layout object for the Wordle
 * @param {Array} words - Array of "word" objects holding text/size defining the layout
 * @param {Wordle} instance - The Wordle instance for which the layout is to be rendered
 */
inverted_wordles.drawLayout = function (layout, words, instance) {
    instance.element.innerHTML = ""; // TODO: move the "g" generation into static code
    var colours = d3.scaleOrdinal(d3.schemeCategory10);
    d3.select(instance.element)
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function (d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function (d) {
            return colours(d.text);
        })
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) { return d.text; });
};

/** Construct the d3 cloud layout object from the supplied Wordle instance
 * @param {Wordle} instance - The Wordle instance for which the layout is to be constructed
 * @return {d3Layout} The layout object for the Wordle
 */
inverted_wordles.makeLayout = function (instance) {
    var maxCount = Math.max.apply(null, instance.answerCounts.map(entry => entry.count));
    var wordRecs = instance.answerCounts.map(function (entry) {
        return {text: entry.word, size: instance.conventional ? 120 * entry.count / maxCount :
            10 * maxCount / entry.count};
    });
    var element = instance.element;
    var layout = d3.layout.cloud()
        .size([element.getAttribute("width"), element.getAttribute("height")])
        .words(wordRecs)
        .padding(5)
        .font("Impact")
        .fontSize(function (d) { return d.size; })
        .on("end", function (words) {
            // Shocking d3 integration model
            inverted_wordles.drawLayout(layout, words, instance);
        });

    layout.start();
    return layout;
};

/** Given the XHR response, render a wordle instance into its configured selector
 * @param {WordleInstance} instance - The wordle instance
 * @param {FetchResponse} response - Fetch response for the answers file from github
 */
inverted_wordles.handleResponse = function (instance, response) {
    response.json().then(function (answersFile) {
        var answerCounts = inverted_wordles.extractAnswers(answersFile);
        if (answerCounts.length !== instance.answerCounts.length) {
            console.log("Updated answerCounts to " + instance.answerCounts.length);
            instance.answerCounts = answerCounts;
            inverted_wordles.makeLayout(instance);
        } else {
            console.log("No change in answer count");
        }
    });
    // Unfortunately "Etag" is a censored CORS header so we will have to do change detection by brute force
    // https://stackoverflow.com/questions/21345814/etag-header-not-returned-from-jquery-ajax-cross-origin-xhr/21346319
    /* for (var pair of response.headers.entries()) {
        console.log(pair[0]+ ": " + pair[1]);
    }*/
};

// Old implementation, disused since
// i) raw.githubusercontent does not permit CORS preflight requests configuring cache control
// ii) its cache is hardwired to only update every 300 seconds
/*
inverted_wordles.fetchAnswers = function (instance) {
    var url = inverted_wordles.stringTemplate(
        "https://raw.githubusercontent.com/${repo_owner}/${repo_name}/${branch}/src/_data/answers.json", wordle_globals);
    fetch(url, {
        cache: "no-store"
    }
    //, {
    //    headers: {
    //        "Cache-Control": "no-store, max-age=0"
    //    }
    //}).then(function (response) {
        inverted_wordles.handleResponse(instance, response);
    }, function (error) {
        console.log("Error fetching url " + url + ": ", error);
    });
};
*/

/** Fetch the answers file from github and perform an initial render of the world into the supplied selector. Initialise
 * data in the Wordle instance, and resolving github coordinates from the `wordle_globals` global
 * rendered into the initial markup
 * @param {WordleInstance} instance - The wordle instance to be initialised
 */
inverted_wordles.fetchAnswers = function (instance) {
    var url = "/api/fetch_answer/" + wordle_globals.branch;
    fetch(url).then(function (response) {
        inverted_wordles.handleResponse(instance, response);
    }, function (error) {
        console.log("Error fetching url " + url + ": ", error);
    });
};

/** Bind the global wordle instance to the "conventional layout" checkbox
 * @param {String} selector - Selector to the checkbox to be bound
 * @param {WordleInstance} instance - The wordle instance
 */
inverted_wordles.bindConventional = function (selector, instance) {
    var element = document.querySelector(selector);
    element.addEventListener("change", function () {
        instance.conventional = this.checked;
        inverted_wordles.makeLayout(instance);
    });
};

inverted_wordles.initWordle = function (options) {
    var instance = inverted_wordles.instance;
    inverted_wordles.instance.element = document.querySelector(options.selectors.render);
    inverted_wordles.fetchAnswers(instance);
    inverted_wordles.bindConventional(options.selectors.conventional, instance);
    instance.pollInterval = setInterval(function () {
        inverted_wordles.fetchAnswers(instance);
    }, 5000);
    // Poll for a maximum of 10 minutes before cancelling
    instance.cancelPoll = setInterval(function () {
        clearInterval(instance.pollInterval);
        instance.pollInterval = null;
    }, 10 * 60 * 1000);
};

// Represents the singleton "instance" of the Wordle, which will be progressively initialised by calls starting at
// inverted_worldes.initWordle
inverted_wordles.instance = {
    // DOM element holding the rendered SVG
    element: null,
    // Vector of words and their counts
    answerCounts: [],
    // Whether the word sizing strategy uses the "inverted" approach (the default, false) or the "conventional" where size scales with count
    conventional: false,
    // The intervalID for polling github for updates
    pollInterval: null,
    // The intervalID for cancelling the polling
    cancelPoll: null
};
