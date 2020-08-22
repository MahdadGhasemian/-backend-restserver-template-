"use strict";

module.exports = function (app) {
  var testController = require("../controllers/testController");

  app.route("/test/get").get(testController.get);
};
