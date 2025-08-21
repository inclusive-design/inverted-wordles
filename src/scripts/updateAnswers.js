/**
 * updateAnswers.js
 *
 * This script generates or updates a JSON file in the `src/_data` directory.
 *
 * Usage:
 *  node src/scripts/updateAnswers.js <filename> <n> <answer1> <answer2> ...
 *
 * Parameters:
 *
 *  <filename> - The name of the JSON file to create or update, without file extension.
 *  <n> - Number of entries to generate.
 *  <answer...> - One or more answer strings.
 *
 * Example:
 *  node src/scripts/updateAnswers.js example-wordle-answers 3 "answer1" "answer2"
 *
 *  creates or updates `src/_data/example-wordle-answers.json` with 3 new entries of answer1 and answer2.
 *
 */

"use strict";

const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

let [filename, nStr, ...answers] = process.argv.slice(2);
const n = parseInt(nStr, 10);

if (!filename) {
    console.error("Please provide a filename as the first argument.");
    process.exit(1);
}

if (filename && filename.toLowerCase().endsWith(".json")) {
    filename = filename.slice(0, -5);
}

if (isNaN(n) || n <= 0) {
    console.error("Please provide a valid positive number for n as the second argument.");
    process.exit(1);
}

if (answers.length === 0) {
    console.error("Please provide at least one answer.");
    process.exit(1);
}

const outputDir = path.join(__dirname, "../_data");
const outputFile = path.join(outputDir, `${filename}.json`);

let previousData = {};
if (fs.existsSync(outputFile)) {
    try {
        const fileContent = fs.readFileSync(outputFile, "utf8").trim();
        if (fileContent) {
            previousData = JSON.parse(fileContent);
        }
    } catch (err) {
        console.error(`Error reading existing JSON: ${err}`);
        process.exit(1);
    }
}

// Generate n entries
for (let i = 0; i < n; i++) {
    const id = uuidv4();
    previousData[id] = {
        answers,
        createdTimestamp: new Date().toISOString()
    };
}

fs.writeFileSync(outputFile, JSON.stringify(previousData, null, 2), "utf8");

console.log(`Added ${n} entries to ${outputFile}`);
