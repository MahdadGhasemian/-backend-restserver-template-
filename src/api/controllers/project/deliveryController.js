"use strict";
const apiResponse = require("../../apiResponse");
const authManager = require("../../authManager");
const deliveryModel = require("database").deliveryModel;
const deliverys = require("database").deliverys;
const logger = require("logger");
const dateHelper = require("helpers").dateHelper;

exports.gets = function (req, res) {
  try {
    authManager.checkUserAuthentication(req, res, function (user) {
      let skip = 0;
      let limit = 20;
      if (req.body.skip) skip = req.body.skip;
      if (req.body.limit) limit = req.body.limit;

      let userId = user._id;
      deliverys.getsByUserId(userId, skip, limit, function (
        error,
        result
      ) {
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
        let deliveryId = req.body._id;
        let userId = user._id;
        deliverys.getByIdAndUserId(deliveryId, userId, function (
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
      let code = getUniqueCode();
      let product_id = req.body.product_id;
      let customer_id = req.body.customer_id;
      let total = req.body.total;
      let car_id = req.body.car_id;
      let driver_id = req.body.driver_id;
      let date_delivery = req.body.date_delivery;
      let status = req.body.status;
      let note = req.body.note;

      let userId = user._id;
      let newDelivery = new deliveryModel(
        userId,
        code,
        product_id,
        customer_id,
        total,
        car_id,
        driver_id,
        date_delivery,
        status,
        note,

        null
      );

      deliverys.add(newDelivery, function (error, result) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else {
          deliverys.getByIdAndUserId(result.insertedId, userId, function (
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
        let deliveryId = req.body._id;

        let product_id = req.body.product_id;
        let customer_id = req.body.customer_id;
        let total = req.body.total;
        let car_id = req.body.car_id;
        let driver_id = req.body.driver_id;
        let date_delivery = req.body.date_delivery;
        let status = req.body.status;
        let note = req.body.note;

        let userId = user._id;
        let editDelivery = new deliveryModel(
          null,
          null,
          product_id,
          customer_id,
          total,
          car_id,
          driver_id,
          date_delivery,
          status,
          note,

          null
        );

        deliverys.updateByIdAndUserId(
          deliveryId,
          userId,
          editDelivery,
          function (error, result) {
            if (error) {
              logger.log_error(error);
              apiResponse.sendInternalError(res, error);
            } else {
              deliverys.getByIdAndUserId(deliveryId, userId, function (
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
          }
        );
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
        let deliveryId = req.body._id;

        let editDelivery = new deliveryModel(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,

          true
        );

        deliverys.updateByIdAndUserId(
          deliveryId,
          userId,
          editDelivery,
          function (error, result) {
            if (error) {
              logger.log_error(error);
              apiResponse.sendInternalError(res, error);
            } else {
              return apiResponse.sendSucces(res);
            }
          }
        );
      });
    }
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.gets_date = function (req, res) {
  try {
    authManager.checkUserAuthentication(req, res, function (user) {
      let skip = 0;
      let limit = 100;
      if (req.body.skip) skip = req.body.skip;
      if (req.body.limit) limit = req.body.limit;
      let date = req.body.date;

      let userId = user._id;
      dateHelper
        .getStartEndDates({
          date: date,
        })
        .then((outputDates) => {
          deliverys.getsDateRangeByUserId(
            outputDates.date.start,
            outputDates.date.end,
            skip,
            limit,
            userId,
            function (error, result) {
              if (error) {
                logger.log_error(error);
                apiResponse.sendInternalError(res, error);
              } else {
                apiResponse.sendSucces(res, {
                  total: -1,
                  data: result,
                });
              }
            }
          );
        })
        .catch((error) => {
          apiResponse.sendInternalError(res, error);
          logger.log_error(error);
        });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.gets_date_range = function (req, res) {
  try {
    authManager.checkUserAuthentication(req, res, function (user) {
      let skip = 0;
      let limit = 100;
      if (req.body.skip) skip = req.body.skip;
      if (req.body.limit) limit = req.body.limit;
      let dateStart = req.body.date_start;
      let dateEnd = req.body.date_end;

      let userId = user._id;
      dateHelper
        .toValidDate({
          dateStart: dateStart,
          dateEnd: dateEnd,
        })
        .then((outputDates) => {
          deliverys.getsDateRangeByUserId(
            outputDates.dateStart,
            outputDates.dateEnd,
            skip,
            limit,
            userId,
            function (error, result) {
              if (error) {
                logger.log_error(error);
                apiResponse.sendInternalError(res, error);
              } else {
                apiResponse.sendSucces(res, {
                  total: -1,
                  data: result,
                });
              }
            }
          );
        })
        .catch((error) => {
          apiResponse.sendInternalError(res, error);
          logger.log_error(error);
        });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

function getUniqueCode() {
  return (
    Date.now().toString(36) + Math.random().toString(10).substr(4, 16)
  ).toUpperCase();
}
