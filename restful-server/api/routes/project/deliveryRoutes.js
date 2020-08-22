"use strict";

module.exports = function (app) {
  var deliveryController = require("../../controllers/project/deliveryController");

  app.route("/projects/delivery/gets").post(deliveryController.gets);
  app.route("/projects/delivery/get").post(deliveryController.get);
  app.route("/projects/delivery/add").post(deliveryController.add);
  app.route("/projects/delivery/edit").post(deliveryController.edit);
  app.route("/projects/delivery/delete").post(deliveryController.delete);
  app.route("/projects/delivery/gets/date").post(deliveryController.gets_date);
  app
    .route("/projects/delivery/gets/dateRange")
    .post(deliveryController.gets_date_range);
};
