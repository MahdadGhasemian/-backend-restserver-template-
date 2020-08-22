"use strict";
const mongodb = require("mongodb");

function deliveryModel(
  user_id,
  code,
  product_id,
  customer_id,
  total,
  car_id,
  driver_id,
  date_delivery,
  status,
  note,

  deleted
) {
  if (user_id) this.user_id = new mongodb.ObjectID(user_id);
  if (code) this.code = String(code);
  if (product_id) this.product_id = new mongodb.ObjectID(product_id);
  if (customer_id) this.customer_id = new mongodb.ObjectID(customer_id);
  if (total || total === 0) this.total = Number(total);
  if (car_id) this.car_id = new mongodb.ObjectID(car_id);
  if (driver_id) this.driver_id = new mongodb.ObjectID(driver_id);
  if (date_delivery) this.date_delivery = date_delivery;
  if (status || status === 0) this.status = Number(status);
  if (note) this.note = String(note);

  if (deleted === false || deleted === true) this.deleted = deleted;
}

module.exports = deliveryModel;
