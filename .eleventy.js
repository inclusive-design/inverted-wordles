"use strict";

const errorOverlay = require("eleventy-plugin-error-overlay");
const fs = require("fs");

const htmlMinifyTransform = require("./src/transforms/html-minify.js");
const slugFilter = require("./src/filters/slug.js");

require("./src/js/utils.js");

module.exports = function (eleventyConfig) {
    // Watch SCSS files.
    eleventyConfig.addWatchTarget("./src/scss/");

    // Add plugins.
    eleventyConfig.addPlugin(errorOverlay);

    // Add filters.
    eleventyConfig.addFilter("slug", slugFilter);

    // Add transforms.
    eleventyConfig.addTransform("htmlmin", htmlMinifyTransform);

    // Configure passthrough file copy.
    eleventyConfig.addPassthroughCopy({"manifest.json": "manifest.json"});
    eleventyConfig.addPassthroughCopy({"src/js": "js"});

    // Configure BrowserSync.
    eleventyConfig.setBrowserSyncConfig({
        ...eleventyConfig.browserSyncConfig,
        callbacks: {
            ready: (error, browserSync) => {
                // TODO: Add custom 404 page.
                const content404 = fs.readFileSync("dist/404.html");

                // Provides the 404 content without redirect.
                browserSync.addMiddleware("*", (request, response) => {
                    response.write(content404);
                    response.writeHead(404);
                    response.end();
                });
            }
        }
    });

    return {
        dir: {
            input: "src",
            output: "dist"
        },
        passthroughFileCopy: true
    };
};
