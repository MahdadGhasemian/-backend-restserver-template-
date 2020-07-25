"use strict";
const apiResponse = require("../../apiResponse");
const authManager = require("../../authManager");
const productModel = require("database").productModel;
const products = require("database").products;
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
      products.getsByUserId(userId, skip, limit, function (error, result) {
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
        let productId = req.body._id;
        let userId = user._id;
        products.getByIdAndUserId(productId, userId, function (error, result) {
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
      let unit = req.body.unit;
      let color = req.body.color;
      let note = req.body.note;

      let userId = user._id;
      let newProduct = new productModel(
        userId,
        name,
        unit,
        color,
        note,

        null
      );

      products.add(newProduct, function (error, result) {
        if (error) {
          logger.log_error(error);
          apiResponse.sendInternalError(res, error);
        } else {
          products.getByIdAndUserId(result.insertedId, userId, function (
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
        let productId = req.body._id;

        let name = req.body.name;
        let unit = req.body.unit;
        let color = req.body.color;
        let note = req.body.note;

        let userId = user._id;
        let editProduct = new productModel(
          null,
          name,
          unit,
          color,
          note,

          null
        );

        products.updateByIdAndUserId(productId, userId, editProduct, function (
          error,
          result
        ) {
          if (error) {
            logger.log_error(error);
            apiResponse.sendInternalError(res, error);
          } else {
            products.getByIdAndUserId(productId, userId, function (
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
        let productId = req.body._id;
        deliverys.getsCountByProductIdAndUserId(productId, userId, function (
          error,
          count
        ) {
          if (error) {
            logger.log_error(error);
            apiResponse.sendInternalError(res, error);
          } else {
            if (Number(count) === 0) {
              let editProduct = new productModel(
                null,
                null,
                null,
                null,
                null,

                true
              );

              products.updateByIdAndUserId(
                productId,
                userId,
                editProduct,
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
                "This product has been used in some delivery!"
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
