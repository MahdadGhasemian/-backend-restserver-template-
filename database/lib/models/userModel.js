"use strict";

function userModel(user_name, password, name, email, image_uri, date) {
  if (user_name) this.user_name = String(user_name);
  if (password) this.password = String(password);
  if (name) this.name = String(name);
  if (email) this.email = String(email);
  if (image_uri) this.image_uri = String(image_uri);
  if (date) this.date = date;
}

module.exports = userModel;
