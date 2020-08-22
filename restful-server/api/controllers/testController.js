"use strict";

const apiResponse = require("../apiResponse");

exports.get = function (req, res) {
  try {
    return apiResponse.sendSucces(res, {
      Hello: "Hello",
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
