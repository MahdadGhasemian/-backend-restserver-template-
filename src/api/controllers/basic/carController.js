"use strict";
const apiResponse = require("../../apiResponse");
const authManager = require("../../authManager");
const carModel = require("database").carModel;
const licensePlateModel = require("database").licensePlateModel;
const cars = require("database").cars;
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
      cars.getsByUserId(userId, skip, limit, function (error, result) {
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
        let carId = req.body._id;
        let userId = user._id;
        cars.getByIdAndUserId(carId, userId, function (error, result) {
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
      let inputLicensePlate = req.body.license_plate;
      let color = req.body.color;
      let note = req.body.note;

      let licensePlate;
      if (inputLicensePlate) {
        licensePlate = new licensePlateModel(
          inputLicensePlate.province,
          inputLicensePlate.three_part,
          inputLicensePlate.city,
          inputLicensePlate.two_part,
          inputLicensePlate.type
        );
      }
      let userId = user._id;
      let newCar = new carModel(
        userId,
        name,
        licensePlate,
        color,
        note,

        null
      );

      cars.add(newCar, function (error, result) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else {
          cars.getByIdAndUserId(result.insertedId, userId, function (
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
        let carId = req.body._id;

        let name = req.body.name;
        let inputLicensePlate = req.body.license_plate;
        let color = req.body.color;
        let note = req.body.note;

        let licensePlate;
        if (inputLicensePlate) {
          licensePlate = new licensePlateModel(
            inputLicensePlate.province,
            inputLicensePlate.three_part,
            inputLicensePlate.city,
            inputLicensePlate.two_part,
            inputLicensePlate.type
          );
        }

        let userId = user._id;
        let editCar = new carModel(
          null,
          name,
          licensePlate,
          color,
          note,

          null
        );

        cars.updateByIdAndUserId(carId, userId, editCar, function (
          error,
          result
        ) {
          if (error) {
            logger.log_error(error);
            apiResponse.sendInternalError(res, error);
          } else {
            cars.getByIdAndUserId(carId, userId, function (error, result) {
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
        let carId = req.body._id;
        deliverys.getsCountByCarIdAndUserId(carId, userId, function (
          error,
          count
        ) {
          if (error) {
            logger.log_error(error);
            apiResponse.sendInternalError(res, error);
          } else {
            if (Number(count) === 0) {
              let editCar = new carModel(
                null,
                null,
                null,
                null,
                null,

                true
              );

              cars.updateByIdAndUserId(carId, userId, editCar, function (
                error,
                result
              ) {
                if (error) {
                  logger.log_error(error);
                  apiResponse.sendInternalError(res, error);
                } else {
                  return apiResponse.sendSucces(res);
                }
              });
            } else {
              return apiResponse.sendConflictError(
                res,
                "This car has been used in some delivery!"
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
