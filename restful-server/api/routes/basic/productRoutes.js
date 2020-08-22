"use strict";

module.exports = function (app) {
  var productController = require("../../controllers/basic/productController");

  app.route("/basics/product/gets").post(productController.gets);
  app.route("/basics/product/get").post(productController.get);
  app.route("/basics/product/add").post(productController.add);
  app.route("/basics/product/edit").post(productController.edit);
  app.route("/basics/product/delete").post(productController.delete);
};
