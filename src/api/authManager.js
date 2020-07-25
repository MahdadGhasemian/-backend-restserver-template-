var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../../config");
let logger = require("logger");
const apiResponse = require("./apiResponse");
const databaseManager = require("database");

exports.checkUserAuthentication = function (req, res, callback) {
  try {
    var token = req.headers["x-access-token"];
    if (!token) {
      apiResponse.sendUnAuthorized(res);
      logger.log_info("user authentication failed");
      return;
    }
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        apiResponse.sendUnAuthorized(res);
        logger.log_info("user authentication failed");
        logger.log_error(err);
        return;
      }
      databaseManager.users.getById(decoded.id, function (err, user) {
        if (err)
          return apiResponse.sendUnAuthorized(res, "error1 in find user");
        if (!user)
          return apiResponse.sendUnAuthorized(res, "error2 in find user");
        callback(user);
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.login = function (inputPassword, password, user_id, res, callback) {
  try {
    if (!password) return apiResponse.sendUnAuthorized(res);

    let passwordIsValid = bcrypt.compareSync(inputPassword, password);

    if (!passwordIsValid) return apiResponse.sendUnAuthorized(res);

    let token = jwt.sign({ id: user_id }, config.secret, {
      expiresIn: config.token_expires_in,
    });

    let date = new Date(Date.now() + config.token_expires_in * 1000);

    callback(token, date.toISOString());
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendUnAuthorized(res, error);
  }
};
