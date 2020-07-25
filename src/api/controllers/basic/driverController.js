"use strict";
const apiResponse = require("../../apiResponse");
const authManager = require("../../authManager");
const driverModel = require("database").driverModel;
const drivers = require("database").drivers;
const deliverys = require("database").deliverys;
const logger = require("logger");

exports.gets = function (req, res) {
  try {
    authManager.checkUserAuthentication(req, res, function (user) {
      let skip = 0;
      let limit = 20;
      if (req.body.skip) skip = req.body.skip;
      if (req.body.limit) limit = req.body.limit;

      let userId = user._id;
      drivers.getsByUserId(userId, skip, limit, function (error, result) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else {
          apiResponse.sendSucces(res, {
            total: -1,
            data: result,
          });
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.get = function (req, res) {
  try {
    if (!req.body._id) apiResponse.sendBadRequest(res);
    else {
      authManager.checkUserAuthentication(req, res, function (user) {
        let driverId = req.body._id;
        let userId = user._id;
        drivers.getByIdAndUserId(driverId, userId, function (error, result) {
          if (error) {
            logger.log_error(error);
            return apiResponse.sendInternalError(res, error);
          }
          if (!result) return apiResponse.sendNotFound(res);

          delete result.user_id;
          return apiResponse.sendSucces(res, result);
        });
      });
    }
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.add = function (req, res) {
  try {
    authManager.checkUserAuthentication(req, res, function (user) {
      let name = req.body.name;
      let email = req.body.email;
      let mobile_phone = req.body.mobile_phone;
      let phone = req.body.phone;
      let address = req.body.address;
      let note = req.body.note;

      let userId = user._id;
      let newDriver = new driverModel(
        userId,
        name,
        email,
        mobile_phone,
        phone,
        address,
        note,

        null
      );

      drivers.add(newDriver, function (error, result) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else {
          drivers.getByIdAndUserId(result.insertedId, userId, function (
            error,
            result
          ) {
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

exports.edit = function (req, res) {
  try {
    if (!req.body._id) apiResponse.sendBadRequest(res);
    else {
      authManager.checkUserAuthentication(req, res, function (user) {
        let driverId = req.body._id;

        let name = req.body.name;
        let email = req.body.email;
        let mobile_phone = req.body.mobile_phone;
        let phone = req.body.phone;
        let address = req.body.address;
        let note = req.body.note;

        let userId = user._id;
        let editDriver = new driverModel(
          null,
          name,
          email,
          mobile_phone,
          phone,
          address,
          note,

          null
        );

        drivers.updateByIdAndUserId(driverId, userId, editDriver, function (
          error,
          result
        ) {
          if (error) {
            logger.log_error(error);
            apiResponse.sendInternalError(res, error);
          } else {
            drivers.getByIdAndUserId(driverId, userId, function (
              error,
              result
            ) {
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
    }
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.delete = function (req, res) {
  try {
    if (!req.body._id) apiResponse.sendBadRequest(res);
    else {
      authManager.checkUserAuthentication(req, res, function (user) {
        let userId = user._id;
        let driverId = req.body._id;
        deliverys.getsCountByDriverIdAndUserId(driverId, userId, function (
          error,
          count
        ) {
          if (error) {
            logger.log_error(error);
            apiResponse.sendInternalError(res, error);
          } else {
            if (Number(count) === 0) {
              let editDriver = new driverModel(
                null,
                null,
                null,
                null,
                null,
                null,
                null,

                true
              );

              drivers.updateByIdAndUserId(
                driverId,
                userId,
                editDriver,
                function (error, result) {
                  if (error) {
                    logger.log_error(error);
                    apiResponse.sendInternalError(res, error);
                  } else {
                    return apiResponse.sendSucces(res);
                  }
                }
              );
            } else {
              return apiResponse.sendConflictError(
                res,
                "This driver has been used in some delivery!"
              );
            }
          }
        });
      });
    }
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
