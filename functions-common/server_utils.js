"use strict";

const invalidRequestResponse = {
    statusCode: 400,
    body: JSON.stringify({
        message: "Invalid HTTP request method or missing field values or missing environment variables."
    })
};

exports.invalidRequestResponse = invalidRequestResponse;

/**
 * Check if all values required by the endpoint are provided. These values include values sent in the request
 * and values expected to be defined as environment variables.
 * @param {String[]} values - Optional. Values sent in the request.
 * @return {Boolean} Return true if all values exist. Otherwise, return false.
 */
exports.isParamsExist = values => {
    const isAllValuesExist = values ? values.every(value => !!value) : true;
    return isAllValuesExist && process.env.ACCESS_TOKEN && process.env.WORDLES_REPO_OWNER && process.env.WORDLES_REPO_NAME;
};
