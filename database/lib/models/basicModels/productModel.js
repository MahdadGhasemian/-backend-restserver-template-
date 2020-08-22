"use strict";
const mongodb = require("mongodb");

function productModel(
  user_id,
  name,
  unit,
  color,
  note,

  deleted
) {
  if (user_id) this.user_id = new mongodb.ObjectID(user_id);
  if (name || name === "") this.name = String(name);
  if (unit !== null) this.unit = Number(unit);
  if (color || color === "") this.color = String(color);
  if (note || note === "") this.note = String(note);

  if (deleted === false || deleted === true) this.deleted = deleted;
}

module.exports = productModel;
