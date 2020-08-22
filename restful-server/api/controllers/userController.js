"use strict";

const bcrypt = require("bcryptjs");
const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const logger = require("infrastructure").logger;
const users = require("database").users;
const userModel = require("database").userModel;
const dateHelper = require("infrastructure").dateHelper;

exports.get_user_info = function (req, res) {
  try {
    authManager.checkUserAuthentication(req, res, function (user) {
      apiResponse.sendSucces(res, {
        name: user.name,
        email: user.email,
        image_uri: user.image_uri,
      });
    });
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.register_a_user = function (req, res) {
  try {
    if (!req.body.user_name || !req.body.password)
      apiResponse.sendBadRequest(res);
    else {
      let hashedPassword = bcrypt.hashSync(req.body.password, 8);
      let userName = String(req.body.user_name);
      let password = hashedPassword;
      let name = req.body.name;
      let email = req.body.email;
      users.getByUserName(userName, function (error, result) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else {
          if (!result) {
            dateHelper
              .toValidDate({
                date: new Date(),
              })
              .then((outputDates) => {
                let newUser = new userModel(
                  userName,
                  password,
                  name,
                  email,
                  null,
                  outputDates.date
                );

                users.add(newUser, function (error, result) {
                  if (error) {
                    logger.log_error(error);
                    apiResponse.sendInternalError(res, error);
                  } else {
                    authManager.login(
                      req.body.password,
                      password,
                      result.insertedId,
                      res,
                      function (token, expire) {
                        apiResponse.sendSucces(res, {
                          "x-access-token": token,
                          "X-Expires-After": expire,
                        });
                      }
                    );
                  }
                });
              })
              .catch((error) => {
                apiResponse.sendInternalError(res, error);
                logger.log_error(error);
              });
          } else {
            apiResponse.sendConflictError(res, "username already exists");
          }
        }
      });
    }
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.login = function (req, res) {
  try {
    if (!req.body.user_name || !req.body.password) {
      apiResponse.sendBadRequest(res);
    } else {
      let userName = String(req.body.user_name);
      users.getWithPasswordByUserName(userName, function (error, user) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else if (!user) {
          return apiResponse.sendNotFound(
            res,
            "Invalid username/password supplied"
          );
        } else {
          authManager.login(
            req.body.password,
            user.password,
            user._id,
            res,
            function (token, expire) {
              apiResponse.sendSucces(res, {
                "x-access-token": token,
                "X-Expires-After": expire,
              });
            }
          );
        }
      });
    }
  } catch (error) {
    logger.log_error(error);
    return apiResponse.sendInternalError(res, error);
  }
};

exports.logout = function (req, res) {
  try {
    apiResponse.sendSucces(res);
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.change_password = function (req, res) {
  try {
    if (!req.body.now_password || !req.body.new_password)
      apiResponse.sendBadRequest(res);
    else {
      let nowPassword = String(req.body.now_password);
      let newPassword = String(req.body.new_password);

      authManager.checkUserAuthentication(req, res, function (user) {
        let userId = user._id;
        let hashedPassword = bcrypt.hashSync(newPassword, 8);

        let editUser = new userModel(null, hashedPassword);
        users.updateById(userId, editUser, function (error, result) {
          if (error) {
            logger.log_error(error);
            apiResponse.sendInternalError(res, error);
          } else {
            users.getById(userId, function (error, resultUser) {
              if (error) {
                logger.log_error(error);
                apiResponse.sendInternalError(res, error);
              } else {
                authManager.login(
                  newPassword,
                  resultUser.password,
                  resultUser._id,
                  res,
                  function (token, expire) {
                    apiResponse.sendSucces(res, {
                      "x-access-token": token,
                      "X-Expires-After": expire,
                    });
                  }
                );
              }
            });
          }
        });
      });
    }
  } catch (error) {
    logger.log_error(error);
    return apiResponse.sendInternalError(res, error);
  }
};
