"use strict";

module.exports = function (app) {
  var carController = require("../../controllers/basic/carController");

  app.route("/basics/car/gets").post(carController.gets);
  app.route("/basics/car/get").post(carController.get);
  app.route("/basics/car/add").post(carController.add);
  app.route("/basics/car/edit").post(carController.edit);
  app.route("/basics/car/delete").post(carController.delete);
};
