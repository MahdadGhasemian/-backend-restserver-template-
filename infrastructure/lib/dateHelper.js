const moment = require("moment");
const momentTimezone = require("moment-timezone");

class dateHelper {
  constructor() {}

  toValidDate(inputObject) {
    return new Promise((resolve, reject) => {
      try {
        let maxLenght = Object.keys(inputObject).length;
        let counter = 0;
        Object.keys(inputObject).forEach(function (key) {
          let value = inputObject[key];
          if (value) {
            let inputMoment = moment(value);
            if (!inputMoment.isValid()) {
              inputObject[key] = null;
            } else {
              let gmtString = inputMoment.toDate().toGMTString();
              let isoDate = new Date(Date.parse(gmtString));
              inputObject[key] = isoDate;
            }
          } else inputObject[key] = null;
          counter++;
          if (counter == maxLenght) resolve(inputObject);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getStartEndToday() {
    return new Promise((resolve, reject) => {
      try {
        let startLocalTodayIsoStr = momentTimezone
          .tz("Asia/Tehran")
          .startOf("day")
          .format();
        let startLocalTodayIso = new Date(Date.parse(startLocalTodayIsoStr));

        let endLocalTodayIsoStr = momentTimezone
          .tz("Asia/Tehran")
          .endOf("day")
          .format();
        let endLocalTodayIso = new Date(Date.parse(endLocalTodayIsoStr));

        resolve({
          start: startLocalTodayIso,
          end: endLocalTodayIso,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getStartEnd30Day() {
    return new Promise((resolve, reject) => {
      try {
        let startLocalTodayIsoStr = momentTimezone
          .tz("Asia/Tehran")
          .startOf("day")
          .format();
        let startLocalTodayIso = new Date(Date.parse(startLocalTodayIsoStr));

        let oneDayInMilli = 24 * 60 * 60 * 1000;
        let startLocal30DayAgoIso = new Date(
          startLocalTodayIso.getTime() - 30 * oneDayInMilli
        );

        let endLocalTodayIsoStr = momentTimezone
          .tz("Asia/Tehran")
          .endOf("day")
          .format();
        let endLocalTodayIso = new Date(Date.parse(endLocalTodayIsoStr));

        resolve({
          start: startLocal30DayAgoIso,
          end: endLocalTodayIso,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getStartEndDates(inputObject) {
    return new Promise((resolve, reject) => {
      try {
        let maxLenght = Object.keys(inputObject).length;
        let counter = 0;
        Object.keys(inputObject).forEach(function (key) {
          let value = inputObject[key];
          if (value) {
            let inputMoment = moment(value);
            if (!inputMoment.isValid()) {
              inputObject[key] = null;
            } else {
              let valueIso = moment(value).toDate();

              let startLocalTodayIsoStr = momentTimezone(valueIso)
                .tz("Asia/Tehran")
                .startOf("day")
                .format();
              let startLocalTodayIso = new Date(
                Date.parse(startLocalTodayIsoStr)
              );

              let endLocalTodayIsoStr = momentTimezone(valueIso)
                .tz("Asia/Tehran")
                .endOf("day")
                .format();
              let endLocalTodayIso = new Date(Date.parse(endLocalTodayIsoStr));

              inputObject[key] = {
                start: startLocalTodayIso,
                end: endLocalTodayIso,
              };
            }
          } else inputObject[key] = null;
          counter++;
          if (counter == maxLenght) resolve(inputObject);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getDiiferenceInDay(date_1, date_2) {
    return moment(date_1).diff(moment(date_2), "days");
  }

  getDiiferenceInSecond(date_1, date_2) {
    return moment(date_1).diff(moment(date_2), "second");
  }
}

module.exports = dateHelper;
