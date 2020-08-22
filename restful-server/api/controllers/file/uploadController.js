const apiResponse = require("../../apiResponse");
const authManager = require("../../authManager");
const config = require("../../../../config");
const logger = require("infrastructure").logger;
const multer = require("multer");
const path = require("path");

let name = "";

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let imagePath = path.join(
      __dirname +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/Images/" +
        "logoes/"
    );
    callback(null, imagePath);
  },
  filename: function (req, file, callback) {
    callback(null, name);
  },
});

let storage2 = multer.diskStorage({
  destination: function (req, file, callback) {
    let imagePath = path.join(
      __dirname +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/Images/" +
        "logoes/"
    );
    if (req.params.path != undefined) {
      callback(null, imagePath);
    } else {
      callback("error", imagePath);
    }
  },
  filename: function (req, file, callback) {
    let name = req.params.name;
    if (req.params.name != undefined) {
      callback(null, name);
    } else {
      callback("error", name);
    }
  },
});

let uploadMulter = multer({
  storage: storage,
  limits: { fileSize: config.upload_file_max_size },
}).any(); //.single('image');

exports.upload = function (req, res) {
  try {
    authManager.checkUserAuthentication(
      req,
      res,
      2,
      serviceRolesArray,
      false,
      function (user, contractId) {
        if (contractId) {
          name =
            "9c0a7a1d6" +
            String(contractId) +
            "a75B42j" +
            new Date().getTime() +
            ".jpg";
          uploadMulter(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              if (err.code === "LIMIT_FILE_SIZE") {
                const message =
                  " حداکثر سایز مجاز فایل " +
                  String(config.upload_file_max_size / 1024) +
                  " کیلو بایت می باشد ";
                apiResponse.sendInternalError(res, message);
              } else apiResponse.sendInternalError(res, err);
            } else if (err) {
              apiResponse.sendInternalError(res, err);
            } else {
              apiResponse.sendSucces(res, {
                name: name,
              });
            }
          });
        } else {
          apiResponse.sendInternalError(res, "");
        }
      }
    );
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.send_logo = function (req, res) {
  try {
    authManager.checkUserAuthentication(
      req,
      res,
      2,
      serviceRolesArray,
      false,
      function (user, contractId) {
        if (contractId) {
          name =
            "9c0a7a1d6" +
            String(contractId) +
            "c97B46j" +
            new Date().getTime() +
            ".jpg";
          uploadMulter(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              if (err.code === "LIMIT_FILE_SIZE") {
                const message =
                  " حداکثر سایز مجاز فایل " +
                  String(config.upload_file_max_size / 1024) +
                  " کیلو بایت می باشد ";
                apiResponse.sendInternalError(res, message);
              } else apiResponse.sendInternalError(res, err);
            } else if (err) {
              apiResponse.sendInternalError(res, err);
            } else {
              apiResponse.sendSucces(res, {
                name: name,
              });
            }
          });
        } else {
          apiResponse.sendInternalError(res, "");
        }
      }
    );
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
