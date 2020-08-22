const databaseManager = require("../dataBaseManager").getInstance();
const mongodb = require("mongodb");
const logger = require("infrastructure").logger;

class settingRepository {
  constructor() {
    this.getByUserId = function (userId, callback) {
      try {
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database.collection("settings").findOne(
          {
            user_id: o_user_id,
          },
          function (err, setting) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get setting done");
            callback(null, setting);
          }
        );
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };

    this.updateOrInsertByUserId = function (userId, modifiedFields, callback) {
      try {
        let o_user_id = new mongodb.ObjectID(userId);
        let myquery = {
          user_id: o_user_id,
        };
        delete modifiedFields.user_id;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("settings")
          .updateOne(myquery, newvalues, { upsert: true }, function (err, res) {
            try {
              if (err) {
                logger.log_error(err);
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update setting done");
                return callback(null, true);
              }
              logger.log_info("no setting was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };
  }
}

module.exports = settingRepository;
