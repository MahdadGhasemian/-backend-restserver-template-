"use strict";
const mongodb = require("mongodb");

function driverModel(
  user_id,
  name,
  email,
  mobile_phone,
  phone,
  address,
  note,

  deleted
) {
  if (user_id) this.user_id = new mongodb.ObjectID(user_id);
  if (name || name === "") this.name = String(name);
  if (email || email === "") this.email = String(email);
  if (mobile_phone || mobile_phone === "")
    this.mobile_phone = String(mobile_phone);
  if (phone || phone === "") this.phone = String(phone);
  if (address || address === "") this.address = String(address);
  if (note || note === "") this.note = String(note);

  if (deleted === false || deleted === true) this.deleted = deleted;
}

module.exports = driverModel;
