"use strict";

require("dotenv").config();

module.exports = {
    context: process.env.CONTEXT || "dev"
};
