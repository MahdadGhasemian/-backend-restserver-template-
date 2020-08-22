"use strict";

module.exports = function (app) {
  var driverController = require("../../controllers/basic/driverController");

  app.route("/basics/driver/gets").post(driverController.gets);
  app.route("/basics/driver/get").post(driverController.get);
  app.route("/basics/driver/add").post(driverController.add);
  app.route("/basics/driver/edit").post(driverController.edit);
  app.route("/basics/driver/delete").post(driverController.delete);
};
