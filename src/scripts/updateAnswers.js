const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const [filename, nStr, ...answers] = process.argv.slice(2);
const n = parseInt(nStr, 10);

if (!filename) {
    console.error('Please provide a filename as the first argument.');
    process.exit(1);
}

if (isNaN(n) || n <= 0) {
    console.error('Please provide a valid positive number for n as the second argument.');
    process.exit(1);
}

if (answers.length === 0) {
    console.error('Please provide at least one answer.');
    process.exit(1);
}

const outputDir = path.join(__dirname, '../_data');
const outputFile = path.join(outputDir, `${filename}.json`);

let previousData = {};
if (fs.existsSync(outputFile)) {
    try {
        const fileContent = fs.readFileSync(outputFile, 'utf8').trim();
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

fs.writeFileSync(outputFile, JSON.stringify(previousData, null, 2), 'utf8');

console.log(`Added ${n} entries to ${outputFile}`);