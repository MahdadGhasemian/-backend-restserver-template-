"use strict";
let format = require("util").format;
let logger = require("infrastructure").logger;
let mongo = require("mongodb");

var Singleton = (function () {
  var instance;

  function createInstance() {
    var object = new databaseManager();
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

function databaseManager() {
  this.connected = false;
  this.client = null;
  this.database = null;

  //public methods
  this.connect = function () {
    return new Promise((resolve, reject) => {
      try {
        let user = encodeURIComponent(
          process.env.TEMPLATE_REST_SERVER_MONGOD_USER
        );
        let password = encodeURIComponent(
          process.env.TEMPLATE_REST_SERVER_MONGOD_PASS
        );
        let url = encodeURIComponent(
          process.env.TEMPLATE_REST_SERVER_MONGOD_URL
        );
        let dbname = encodeURIComponent(
          process.env.TEMPLATE_REST_SERVER_MONGOD_DATABASE_NAME
        );
        let inDebug = process.env.TEMPLATE_DEBUG;

        let mongoServerUrl;
        if (inDebug) {
          mongoServerUrl = "mongodb://127.0.0.1:27017/" + dbname;
        } else {
          mongoServerUrl = format(
            "mongodb+srv://%s:%s@%s/%s?retryWrites=true&w=majority",
            user,
            password,
            url,
            dbname
          );
        }

        mongo.connect(
          mongoServerUrl,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
          (err, client) => {
            if (err) {
              logger.log_error(err);
              this.connected = false;
              this.client = null;
              this.database = null;
              reject(err);
            } else {
              this.connected = true;
              this.client = client;
              this.database = client.db(dbname);
              logger.log_info("connected to database");
              resolve();
            }
          }
        );
      } catch (error) {
        logger.log_error(error);
        reject(error);
      }
    });
  };
  this.disconnect = function () {
    return new Promise((resolve, reject) => {
      try {
        if (this.client) {
          this.client.close();
          this.connected = false;
          this.client = null;
          this.database = null;
          logger.log_info("disconnected from database");
          resolve();
        } else {
          resolve();
        }
      } catch (error) {
        logger.log_error(error);
        reject(error);
      }
    });
  };
}

module.exports = Singleton;
