const winston = require("winston");
const fs = require("fs");
var path = require("path");
const logDir = "logs";
var debug =
  typeof v8debug === "object" ||
  /--debug|--inspect/.test(process.execArgv.join(" "));

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var options = {
  file: {
    level: "info",
    filename: path.join(logDir, "/-results.log"),
    //TODO check how winston handles excptions
    handleExceptions: true,
    json: true,
    maxsize: 102400, // 100KB
    maxFiles: 500,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.File(options.file),
    // new(require('winston-daily-rotate-file'))(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

let stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

const logger = {
  // winstonLogger: this.winstonLogger,
  log_info(input) {
    winstonLogger.info(input);
    if (debug) winstonLogger.debug(input);
  },
  log_error(input) {
    winstonLogger.error(input);
    if (debug) winstonLogger.debug("error: " + input);
  },
  stream: stream,
};

module.exports = logger;
