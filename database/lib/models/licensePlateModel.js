"use strict";

function licensePlateModel(province, three_part, city, two_part, type) {
  if (province) this.province = Number(province);
  if (three_part) this.three_part = Number(three_part);
  if (city || city === "") this.city = String(city);
  if (two_part) this.two_part = Number(two_part);
  if (type || type === "") this.type = String(type);
}

module.exports = licensePlateModel;
