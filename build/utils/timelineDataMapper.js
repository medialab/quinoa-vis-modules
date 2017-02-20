'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = mapData;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var computeDate = exports.computeDate = function computeDate(thatYear, thatMonth, thatDay, time) {
  if (thatYear !== 0 && !thatYear) {
    return undefined;
  }

  var date = new Date();
  date.setFullYear(thatYear);

  thatMonth = thatMonth ? date.setMonth(thatMonth - 1) : date.setMonth(0);
  thatDay = thatDay ? date.setDate(thatDay) : date.setDate(1);

  if (time && typeof time === 'string') {
    var vals = time.split(':');

    if (vals.length > 0 && +vals[0] >= 0 && +vals[0] < 24) {
      date.setHours(vals.shift());
    } else {
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
    }

    if (vals.length > 0 && +vals[0] >= 0 && +vals[0] < 60) {
      date.setMinutes(vals.shift());
    } else {
      date.setMinutes(0);
      date.setSeconds(0);
    }

    if (vals.length > 0 && +vals[0] >= 0 && +vals[0] < 60) {
      date.setSeconds(vals.shift());
    } else {
      date.setSeconds(0);
    }
  } else {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
  }
  return date;
};

function mapData() {
  var normalizedData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { main: [] };
  var inputDataMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { main: {} };

  var data = normalizedData.main;
  var dataMap = inputDataMap.main;

  return {
    main: data.map(function (datapoint) {
      return Object.keys(dataMap).reduce(function (obj, dataKey) {
        return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap[dataKey] === 'function' ? dataMap[dataKey](datapoint) 
        : datapoint[dataMap[dataKey]]));
      }, {});
    })
    .map(function (datapoint) {
      var year = datapoint.year,
          month = datapoint.month,
          day = datapoint.day,
          time = datapoint.time,
          endYear = datapoint.endYear,
          endMonth = datapoint.endMonth,
          endDay = datapoint.endDay,
          endTime = datapoint.endTime;


      var startDate = computeDate(year, month, day, time);
      var endDate = computeDate(endYear, endMonth, endDay, endTime);

      return _extends({}, datapoint, {
        startDate: startDate,
        endDate: endDate
      });
    })
    .sort(function (a, b) {
      if (a.startDate.getTime() > b.startDate.getTime()) {
        return 1;
      }
      return -1;
    }) };
}