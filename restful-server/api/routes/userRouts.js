"use strict";

module.exports = function (app) {
  var userController = require("../controllers/userController");

  app.route("/users/login").post(userController.login);
  app.route("/users/logout").post(userController.logout);
  app.route("/users/register").post(userController.register_a_user);
  app.route("/users/changePassword").post(userController.change_password);
  app.route("/users/getUserInfo").post(userController.get_user_info);
};
