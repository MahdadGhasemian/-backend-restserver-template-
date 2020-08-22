"use sctrict";
var HttpStatus = require("http-status-codes");
let logger = require("infrastructure").logger;

exports.sendSucces = function (res, data) {
  try {
    if (res) {
      if (data) res.status(HttpStatus.OK).json(data);
      else res.status(HttpStatus.OK).send();
    }
  } catch (error) {
    logger.log_error(error.message);
  }
};

exports.sendInternalError = function (res, error) {
  try {
    if (res) sendError(res, error, HttpStatus.INTERNAL_SERVER_ERROR);
  } catch (error) {
    logger.log_error(error.message);
  }
};

exports.sendBadRequest = function (res, error) {
  try {
    if (res) sendError(res, error, HttpStatus.BAD_REQUEST);
  } catch (error) {
    logger.log_error(error.message);
  }
};

exports.sendUnAuthorized = function (res, error) {
  try {
    if (res) sendError(res, error, HttpStatus.UNAUTHORIZED);
  } catch (error) {
    logger.log_error(error.message);
  }
};

exports.sendNotFound = function (res, error) {
  try {
    if (res) sendError(res, error, HttpStatus.NOT_FOUND);
  } catch (error) {
    logger.log_error(error.message);
  }
};

exports.sendConflictError = function (res, error) {
  try {
    if (res) sendError(res, error, HttpStatus.CONFLICT);
  } catch (error) {
    logger.log_error(error.message);
  }
};

exports.sendNotAccessed = function (res, error) {
  try {
    if (res) sendError(res, error, HttpStatus.FORBIDDEN);
  } catch (error) {
    logger.log_error(error.message);
  }
};

sendError = function (res, error, code) {
  try {
    if (res) {
      res.status(code).send({
        code: code,
        message: error,
      });
      if (error) logger.log_info(error);
    }
  } catch (error) {
    logger.log_error(error.message);
  }
};

exports.sendSuccesRender = function (res, page) {
  try {
    if (res) {
      if (page) res.status(HttpStatus.OK).sendFile(page);
      else res.status(HttpStatus.OK).send();
    }
  } catch (error) {
    logger.log_error(error.message);
  }
};

exports.sendSuccesRenderStringFile = function (res, strFile) {
  try {
    if (res) {
      if (strFile) res.status(HttpStatus.OK).send(strFile);
      else res.status(HttpStatus.OK).send();
    }
  } catch (error) {
    logger.log_error(error.message);
  }
};
