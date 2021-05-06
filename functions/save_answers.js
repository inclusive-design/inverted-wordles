"use strict";

const {Octokit} = require("@octokit/core");
const axios = require("axios");
const uuid = require("uuid");

const githubAPI = "https://api.github.com";

const octokit = new Octokit({
	auth: process.env.ACCESS_TOKEN
});

exports.handler = async function(event, context, callback) {
	const incomingData = JSON.parse(event.body);
	const uniqueId = uuid.v4();

	// Reject the request when:
	// 1. Not a POST request;
	// 2. Doesn’t provide required values
	if (event.httpMethod !== "POST" || !incomingData["branch"] || !incomingData["answers"]) {
		callback(null, {
			statusCode: 400,
			body: "Invalid HTTP request method or missing field values."
		});
	} else {
		let isError = false, errorMsg;
		const newAnswer = {
			answers: incomingData["answers"],
			createdTimestamp: new Date().toISOString()
		};

		// check if answers.json exits
		octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
		    owner: process.env.WORDLES_REPO_OWNER,
		    repo: process.env.WORDLES_REPO_NAME,
		    path: "src/_data/answers.json",
		    ref: incomingData["branch"]
		}).then((fileExistenceResponse) => {
			// File exists: update the existing answers file
			console.log("Updating an existing answers file...");

			// fetch the existing answers file
			axios.get(fileExistenceResponse.data.download_url).then((downloadResponse) => {
				const jsonFileContent = downloadResponse.data;
				jsonFileContent[uniqueId] = newAnswer;

				// Update an existing answers file
				octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
				    owner: process.env.WORDLES_REPO_OWNER,
				    repo: process.env.WORDLES_REPO_NAME,
				    path: "src/_data/answers.json",
					// Including "[skip ci]" in the commit message notifies Netlify not to trigger a deploy.
					message: "chore: [skip ci] update answers.json",
					content: new Buffer(JSON.stringify(jsonFileContent)).toString("base64"),
					sha: fileExistenceResponse.data.sha,
				    branch: incomingData["branch"]
			    }).catch((error) => {
					isError = true;
					errorMsg = "Error at creating the answers file."
				})
				console.log("Done: Updated the answers file.");
			});
		}).catch(() => {
			// File doesn't exist: create an answers file
			console.log("Creating a new answers file...");

			const jsonFileContent = {};
			jsonFileContent[uniqueId] = newAnswer;

			// Create a new answers file
			octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
			    owner: process.env.WORDLES_REPO_OWNER,
			    repo: process.env.WORDLES_REPO_NAME,
			    path: "src/_data/answers.json",
				// Including "[skip ci]" in the commit message notifies notifies Netlify not to trigger a deploy.
				message: "chore: [skip ci] create answers.json",
				content: new Buffer(JSON.stringify(jsonFileContent)).toString("base64"),
			    branch: incomingData["branch"]
		    }).catch((error) => {
				isError = true;
				errorMsg = "Error at creating the answers file."
			})
			console.log("Done: Created the answers file.");
		});

		callback(null, {
			statusCode: isError ? 500 : 200,
			body: errorMsg ? errorMsg : "Success."
		});
	}
};
