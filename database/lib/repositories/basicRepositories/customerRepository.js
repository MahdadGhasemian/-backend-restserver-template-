const databaseManager = require("../../dataBaseManager").getInstance();
const mongodb = require("mongodb");
const logger = require("infrastructure").logger;

class customerRepository {
  constructor() {
    this.getsByUserId = function (userId, skip, limit, callback) {
      try {
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database
          .collection("customers")
          .find({
            $and: [{ user_id: o_user_id }, { deleted: { $ne: true } }],
          })
          .limit(limit)
          .skip(skip)
          .sort({ number: 1 })
          .toArray(function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get customers done");
            if (res && res.length > 0) {
              for (let i = 0; i < res.length; i++) {
                delete res[i].user_id;
              }
            }
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };

    this.getByIdAndUserId = function (id, userId, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database.collection("customers").findOne(
          {
            $and: [
              { _id: o_id },
              { user_id: o_user_id },
              { deleted: { $ne: true } },
            ],
          },
          function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get customer done");
            callback(null, res);
          }
        );
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };

    this.add = function (newCustomer, callback) {
      try {
        if (newCustomer.user_id)
          newCustomer.user_id = new mongodb.ObjectID(newCustomer.user_id);

        databaseManager.database
          .collection("customers")
          .insertOne(newCustomer, function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("add customer done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    this.updateByIdAndUserId = function (id, userId, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let o_user_id = new mongodb.ObjectID(userId);
        let myquery = {
          $and: [{ _id: o_id }, { user_id: o_user_id }],
        };
        delete modifiedFields.user_id;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("customers")
          .updateOne(myquery, newvalues, function (err, res) {
            try {
              if (err) {
                logger.log_error(err);
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update customer done");
                return callback(null, true);
              }
              logger.log_info("no customer was updated");
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

    this.search = function (filter, skip, limit, callback) {
      try {
        databaseManager.database
          .collection("customers")
          .find(filter)
          .limit(limit)
          .skip(skip)
          .toArray(function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("search customer done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };
  }
}

module.exports = customerRepository;
