"use strict";

module.exports = function (app) {
  var downloadController = require("../../controllers/file/downloadController");

  app
    .route("/download/downloadImage/:path/:name")
    .get(downloadController.download_image);
};
