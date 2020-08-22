"use strict";
const mongodb = require("mongodb");

function settingModel(user_id, title) {
  if (user_id) this.user_id = new mongodb.ObjectID(user_id);
  if (title || title === "") this.title = title;
}

module.exports = settingModel;
