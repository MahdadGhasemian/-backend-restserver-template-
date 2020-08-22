"use strict";

module.exports = function (app) {
  var customerController = require("../../controllers/basic/customerController");

  app.route("/basics/customer/gets").post(customerController.gets);
  app.route("/basics/customer/get").post(customerController.get);
  app.route("/basics/customer/add").post(customerController.add);
  app.route("/basics/customer/edit").post(customerController.edit);
  app.route("/basics/customer/delete").post(customerController.delete);
};
