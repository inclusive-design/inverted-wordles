"use strict";

require("dotenv").config();

module.exports = {
    context: process.env.CONTEXT || "dev",
    repo_owner: process.env.WORDLES_REPO_OWNER,
    repo_name: process.env.WORDLES_REPO_NAME
};
