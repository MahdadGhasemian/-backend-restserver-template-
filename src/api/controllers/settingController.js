"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const logger = require("logger");
const settingModel = require("database").settingModel;
const settings = require("database").settings;

exports.get = function (req, res) {
  try {
    authManager.checkUserAuthentication(req, res, function (user) {
      let userId = user._id;
      settings.getByUserId(userId, function (error, result) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else {
          if (result) {
            delete result.user_id;

            return apiResponse.sendSucces(res, result);
          }
          return apiResponse.sendNotFound(res);
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.save = function (req, res) {
  try {
    authManager.checkUserAuthentication(req, res, function (user) {
      let title = req.body.title;

      let userId = user._id;
      let setting = new settingModel(
        userId,
        title,

        null
      );

      settings.updateOrInsertByUserId(userId, setting, function (
        error,
        result
      ) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else {
          settings.getByUserId(userId, function (error, result) {
            if (error) {
              logger.log_error(error);
              return apiResponse.sendInternalError(res, error);
            }
            if (!result) return apiResponse.sendNotFound(res);
            delete result.user_id;

            return apiResponse.sendSucces(res, result);
          });
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
