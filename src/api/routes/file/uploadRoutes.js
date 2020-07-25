"use strict";

module.exports = function (app) {
  var uploadController = require("../../controllers/file/uploadController");

  app.route("/upload/uploadImage/:path/:name").post(uploadController.upload);
  app.route("/upload/sendLogo/").post(uploadController.send_logo);
};
