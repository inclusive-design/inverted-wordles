"use strict";

/* global inverted_wordles, uuidv4 */

const netlifyUrlSuffix = "--inverted-wordles.netlify.app/";

inverted_wordles.listWordles = function (wordles, wordlesAreaSelector) {
    let wordlesHtml = document.querySelector(wordlesAreaSelector).innerHTML;
    for (const [branchName, questionFile] of Object.entries(wordles)) {
        const workshopName = questionFile.exists && questionFile.content.workshopName ? inverted_wordles.escapeHtml(questionFile.content.workshopName) : "";
        const question = questionFile.exists && questionFile.content.question ? inverted_wordles.escapeHtml(questionFile.content.question) : "";
        const entries = questionFile.exists && questionFile.content.entries ? questionFile.content.entries : "";
        const lastModifiedTimestamp = questionFile.exists && questionFile.content.lastModifiedTimestamp ? questionFile.content.lastModifiedTimestamp.substring(0, 10).replace(/-/g, "/") : "";
        const uniqueId = uuidv4();

        wordlesHtml += `
        <div id="one-wordle-id-${ uniqueId }" class="one-wordle">
            <div class="workshop-name-cell">
                <label for="workshop-name-id-${ uniqueId }">Workshop Name</label>
                <input type="text" id="workshop-name-id-${ uniqueId }" name="workshop-name" value="${ workshopName }">
            </div>
            <div class="question-cell">
                <label for="question-id-${ uniqueId }">Question</label>
                <input type="text" id="question-id-${ uniqueId }" name="question" value="${ question }">
            </div>
            <div class="entries-cell">
                <label for="entries-id-${ uniqueId }">Word Entries</label>
                <input type="text" id="entries-id-${ uniqueId }" name="entries" value="${ entries }">
            </div>
            <div class="view-answer-cell">
                <label for="view-answer-id-${ uniqueId }">Answers</label>
                <a id="view-answer-id-${ uniqueId }" class="button view-answer" href="https://${ branchName + netlifyUrlSuffix }answer/">
                    <svg role="presentation" class="view-answer-svg">
                        <use xlink:href="#view"></use>
                    </svg>
                    View
                </a>
            </div>
            <div class="view-wordle-cell">
                <label for="view-wordle-id-${ uniqueId }">Wordle</label>
                <a id="view-wordle-id-${ uniqueId }" class="button view-wordle" href="https://${ branchName + netlifyUrlSuffix }wordle/">
                    <svg role="presentation" class="view-wordle-svg">
                        <use xlink:href="#view"></use>
                    </svg>
                    View
                </a>
            </div>
            <div class="last-modified-cell">
                <label for="last-modified-id-${ uniqueId }">Last Modified</label>
                <span id="last-modified-id-${ uniqueId }">${ lastModifiedTimestamp }</span>
            </div>
            <div class="delete-cell">
                <button id="delete-id-${ uniqueId }" class="delete-button">
                    <svg role="presentation" class="view-answer-svg">
                        <use xlink:href="#delete"></use>
                    </svg>
                    Delete
                </button>
            </div>
            <div class="one-status" role="status"></div>
            <input type="hidden" name="branchName" value="${ branchName }">
        </div>\n\n`;
    }
    document.querySelector(wordlesAreaSelector).innerHTML = wordlesHtml;
};
