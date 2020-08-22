"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("database");
const logger = require("infrastructure").logger;

const app = express();

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: String(process.env.TEMPLATE_ORIGINS_STRING).split(","),
  methods: ["GET", "PUT", "POST"],
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "X-Requested-With",
    "X-Access-Token",
    "Content-Type",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const userRouts = require("./api/routes/userRouts");
const settingRoutes = require("./api/routes/settingRoutes");
const deliveryRoutes = require("./api/routes/project/deliveryRoutes");
const carRoutes = require("./api/routes/basic/carRoutes");
const driverRoutes = require("./api/routes/basic/driverRoutes");
const customerRoutes = require("./api/routes/basic/customerRoutes");
const productRoutes = require("./api/routes/basic/productRoutes");
const uploadRoutes = require("./api/routes/file/uploadRoutes");
const downloadRoutes = require("./api/routes/file/downloadRoutes");
const testRoutes = require("./api/routes/testRoutes");

function restfulServer() {
  initial();
  this.startListening = startListening;
}

function initial() {
  try {
    database.connect();
    initAllowHeaders();
    initBodyParser();
    registerRoutes();
  } catch (err) {
    logger.log_error(err);
  }
}

function initBodyParser() {
  logger.log_info("Initing body parser");
  app.use(
    bodyParser.json({
      limit: "50mb",
    })
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "50mb",
    })
  );
}

function initAllowHeaders() {
  logger.log_info("Initing allowed headers");
  app.use(cors(corsOptions));
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
  testRoutes(app);
}

var startListening = function () {
  try {
    app.listen(port, () => logger.log_info("Listening on: " + ":" + port));
  } catch (error) {
    logger.log_error(error);
  }
};

module.exports = new restfulServer();
