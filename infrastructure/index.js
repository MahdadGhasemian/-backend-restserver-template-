const dateHelperCons = require("./lib/dateHelper");
const logger = require("./lib/logger");

let dateHelper = new dateHelperCons();

module.exports = {
  dateHelper: dateHelper,
  logger: logger,
};
