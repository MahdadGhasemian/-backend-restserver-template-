"use strict";
const mongodb = require("mongodb");

function carModel(
  user_id,
  name,
  license_plate,
  color,
  note,

  deleted
) {
  if (user_id) this.user_id = new mongodb.ObjectID(user_id);
  if (name || name === "") this.name = String(name);
  if (license_plate) this.license_plate = license_plate;
  if (color || color === "") this.color = String(color);
  if (note || note === "") this.note = String(note);

  if (deleted === false || deleted === true) this.deleted = deleted;
}

module.exports = carModel;
