const databaseManager = require("../dataBaseManager").getInstance();
const mongodb = require("mongodb");
const logger = require("infrastructure").logger;
const userModel = require("../models/userModel");

class userRepository {
  constructor() {
    this.getByUserName = function (userName, callback) {
      try {
        let projectionQuery = {
          fields: {
            password: 0,
          },
        };
        databaseManager.database.collection("users").findOne(
          {
            user_name: userName,
          },
          projectionQuery,
          function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get userName done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getWithPasswordByUserName = function (userName, callback) {
      try {
        databaseManager.database.collection("users").findOne(
          {
            user_name: userName,
          },
          function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get userName done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getById = function (id, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        databaseManager.database.collection("users").findOne(
          {
            _id: o_id,
          },
          function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get user done");
            callback(null, res);
          }
        );
      } catch (error) {
        logger.log_error(err);
        callback(error, null);
      }
    };

    this.add = function (newUser, callback) {
      try {
        databaseManager.database
          .collection("users")
          .insertOne(newUser, function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("add user done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.updateByUserName = function (userName, modifiedFields, callback) {
      try {
        let myquery = {
          user_name: userName,
        };
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("users")
          .updateOne(myquery, newvalues, function (err, res) {
            try {
              if (err) callback(err, null);
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update user done");
                return callback(null, true);
              }
              logger.log_error("no user updated");
              callback(null, false);
            } catch (err) {
              logger.log_error(err);
              callback(err, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.updateById = function (id, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let myquery = {
          _id: o_id,
        };
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("users")
          .updateOne(myquery, newvalues, function (err, res) {
            try {
              if (err) return callback(err, null);
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update user done");
                return callback(null, true);
              }
              logger.log_error("no user updated");
              callback(null, false);
            } catch (err) {
              logger.log_error(err);
              callback(err, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };
  }
}

module.exports = userRepository;
