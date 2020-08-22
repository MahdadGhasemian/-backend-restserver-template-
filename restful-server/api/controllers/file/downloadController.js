const apiResponse = require("../../apiResponse");
const path = require("path");

exports.download_image = function (req, res) {
  try {
    let imagePath = path.join(
      __dirname +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/.." +
        "/Images/" +
        req.params.path +
        "/" +
        req.params.name
    );

    res.download(imagePath);
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
