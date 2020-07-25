"use strict";

const express = require("express");
const database = require("database");
const logger = require("logger");
const bodyParser = require("body-parser");

const app = express();

const host = process.env.TEMPLATE_WEB_SERVER_HOST;
const port = process.env.TEMPLATE_WEB_SERVER_PORT;

const allowedOrigins = String(process.env.TEMPLATE_ORIGINS_STRING).split(",");

const userRouts = require("./api/routes/userRouts");
const settingRoutes = require("./api/routes/settingRoutes");
const deliveryRoutes = require("./api/routes/project/deliveryRoutes");
const carRoutes = require("./api/routes/basic/carRoutes");
const driverRoutes = require("./api/routes/basic/driverRoutes");
const customerRoutes = require("./api/routes/basic/customerRoutes");
const productRoutes = require("./api/routes/basic/productRoutes");
const uploadRoutes = require("./api/routes/file/uploadRoutes");
const downloadRoutes = require("./api/routes/file/downloadRoutes");

function restfulServer() {
  initial();
  this.startListening = startListening;
}

function initial() {
  try {
    database.connect();
    initBodyParser();
    add_Access_Control_Allow_Headers();
    registerRoutes();
  } catch (err) {
    logger.log_error(err);
  }
}

function initBodyParser() {
  logger.log_info("initing body parser");
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
    })
  );
  app.use(
    bodyParser.json({
      limit: "50mb",
    })
  );
}

function add_Access_Control_Allow_Headers() {
  logger.log_info("adding Access_Control_Allow_Headers");

  // Add headers
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    let origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); //, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,x-access-token"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
  });
}

function registerRoutes() {
  logger.log_info("registering routes");

  userRouts(app);
  settingRoutes(app);

  uploadRoutes(app);
  downloadRoutes(app);

  deliveryRoutes(app);

  carRoutes(app);
  driverRoutes(app);
  customerRoutes(app);
  productRoutes(app);
}

var startListening = function () {
  try {
    app.listen(port, host);
    logger.log_info("RESTful API server started on: " + host + ":" + port);
  } catch (error) {
    logger.log_error(error);
  }
};

module.exports = new restfulServer();
