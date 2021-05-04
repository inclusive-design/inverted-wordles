"use strict";

require("dotenv").config();

module.exports = {
    context: process.env.CONTEXT || "dev",
    wordleRepo: "https://github.com/inclusive-design/inverted-wordles"
};
