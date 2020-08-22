const databaseManager = require("../../dataBaseManager").getInstance();
const mongodb = require("mongodb");
const logger = require("infrastructure").logger;

class deliveryRepository {
  constructor() {
    this.getsByUserId = function (userId, skip, limit, callback) {
      try {
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database
          .collection("deliverys")
          .find({
            $and: [{ user_id: o_user_id }, { deleted: { $ne: true } }],
          })
          .limit(limit)
          .skip(skip)
          .sort({ date_delivery: -1 })
          .toArray(function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("gets dekivery done");
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

    this.getsDateRangeByUserId = function (
      dateStart,
      dateEnd,
      userId,
      skip,
      limit,
      callback
    ) {
      try {
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database
          .collection("deliverys")
          .find({
            $and: [
              { user_id: o_user_id },
              { date_delivery: { $gte: dateStart, $lte: dateEnd } },
              { deleted: { $ne: true } },
            ],
          })
          .limit(limit)
          .skip(skip)
          .sort({ date_delivery: -1 })
          .toArray(function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("gets delivery done");
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
        databaseManager.database.collection("deliverys").findOne(
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
            logger.log_info("get delivery done");
            callback(null, res);
          }
        );
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };

    this.getsCountByCarIdAndUserId = function (carId, userId, callback) {
      try {
        let o_car_id = new mongodb.ObjectID(carId);
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database
          .collection("deliverys")
          .find({
            $and: [
              { car_id: o_car_id },
              { user_id: o_user_id },
              { deleted: { $ne: true } },
            ],
          })
          .count(function (err, count) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get count delivery by car id done");
            callback(null, count);
          });
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };

    this.getsCountByCustomerIdAndUserId = function (
      customerId,
      userId,
      callback
    ) {
      try {
        let o_customer_id = new mongodb.ObjectID(customerId);
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database
          .collection("deliverys")
          .find({
            $and: [
              { customer_id: o_customer_id },
              { user_id: o_user_id },
              { deleted: { $ne: true } },
            ],
          })
          .count(function (err, count) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get count delivery by cusmter id done");
            callback(null, count);
          });
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };

    this.getsCountByDriverIdAndUserId = function (driverId, userId, callback) {
      try {
        let o_driver_id = new mongodb.ObjectID(driverId);
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database
          .collection("deliverys")
          .find({
            $and: [
              { driver_id: o_driver_id },
              { user_id: o_user_id },
              { deleted: { $ne: true } },
            ],
          })
          .count(function (err, count) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get count delivery by driver id done");
            callback(null, count);
          });
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };

    this.getsCountByProductIdAndUserId = function (
      productId,
      userId,
      callback
    ) {
      try {
        let o_product_id = new mongodb.ObjectID(productId);
        let o_user_id = new mongodb.ObjectID(userId);
        databaseManager.database
          .collection("deliverys")
          .find({
            $and: [
              { product_id: o_product_id },
              { user_id: o_user_id },
              { deleted: { $ne: true } },
            ],
          })
          .count(function (err, count) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("get count delivery by product id done");
            callback(null, count);
          });
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };

    this.updateByIdAndUserId = function (id, userId, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let o_user_id = new mongodb.ObjectID(userId);
        let myquery = {
          _id: o_id,
          user_id: o_user_id,
        };
        delete modifiedFields.user_id;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("deliverys")
          .updateOne(myquery, newvalues, function (err, res) {
            try {
              if (err) {
                logger.log_error(err);
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update delivery done");
                return callback(null, true);
              }
              logger.log_info("no delivery was updated");
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

    this.add = function (newDelivery, callback) {
      try {
        if (newDelivery.user_id)
          newDelivery.user_id = new mongodb.ObjectID(newDelivery.user_id);

        databaseManager.database
          .collection("deliverys")
          .insertOne(newDelivery, function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("add delivery done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    this.search = function (filter, skip, limit, callback) {
      try {
        databaseManager.database
          .collection("deliverys")
          .find(filter)
          .limit(limit)
          .skip(skip)
          .toArray(function (err, res) {
            if (err) {
              logger.log_error(err);
              return callback(err, null);
            }
            logger.log_info("search delivery done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        return callback(error, null);
      }
    };
  }
}

module.exports = deliveryRepository;
