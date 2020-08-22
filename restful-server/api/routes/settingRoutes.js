"use strict";

module.exports = function (app) {
  var settingController = require("../controllers/settingController");

  app.route("/setting/get").post(settingController.get);
  app.route("/setting/save").post(settingController.save);
};
