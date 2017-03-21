'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTicks = exports.computeDate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; 

exports.default = mapData;

var _d3Time = require('d3-time');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var MONTH = DAY * 31;
var YEAR = DAY * 365;

var computeDate = exports.computeDate = function computeDate(thatYear, thatMonth, thatDay, time) {
  if (thatYear !== 0 && !thatYear) {
    return undefined;
  }

  var date = new Date();
  date.setFullYear(thatYear);

  if (thatMonth) {
    date.setMonth(thatMonth - 1);
  } else {
    date.setMonth(0);
  }

  if (thatDay) {
    date.setDate(thatDay);
  } else {
    date.setDate(1);
  }

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
          _datapoint$endYear = datapoint.endYear,
          endYear = _datapoint$endYear === undefined ? datapoint['end year'] : _datapoint$endYear,
          _datapoint$endMonth = datapoint.endMonth,
          endMonth = _datapoint$endMonth === undefined ? datapoint['end month'] : _datapoint$endMonth,
          _datapoint$endDay = datapoint.endDay,
          endDay = _datapoint$endDay === undefined ? datapoint['end day'] : _datapoint$endDay,
          _datapoint$endTime = datapoint.endTime,
          endTime = _datapoint$endTime === undefined ? datapoint['end time'] : _datapoint$endTime;


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

var setTicks = exports.setTicks = function setTicks(time) {
  var timeVars = function timeVars(unit, span, format) {
    return { unit: unit, span: span, format: format };
  };

  var year = function year(span, format) {
    return timeVars(_d3Time.timeYear, span, format);
  };
  var month = function month(span, format) {
    return timeVars(_d3Time.timeMonth, span, format);
  };
  var day = function day(span, format) {
    return timeVars(_d3Time.timeDay, span, format);
  };
  var hour = function hour(span, format) {
    return timeVars(_d3Time.timeHour, span, format);
  };
  var minute = function minute(span, format) {
    return timeVars(_d3Time.timeMinute, span, format);
  };
  var second = function second(span, format) {
    return timeVars(_d3Time.timeSecond, span, format);
  };

  if (time > YEAR * 1000) {
    return year(500, '%Y');
  }

  if (time > YEAR * 500) {
    return year(250, '%Y');
  }

  if (time > YEAR * 250) {
    return year(125, '%Y');
  }

  if (time > YEAR * 100) {
    return year(50, '%Y');
  }

  if (time > YEAR * 10) {
    return year(10, '%Y');
  }

  if (time > YEAR * 3) {
    return year(1, '%Y');
  }

  if (time > YEAR) {
    return month(6, '%m/%Y');
  }

  if (time > MONTH * 6) {
    return month(1, '%m/%Y');
  }

  if (time > MONTH) {
    return day(15, '%m/%d/%Y');
  }

  if (time > 15 * DAY) {
    return day(3, '%m/%d/%Y');
  }

  if (time > DAY) {
    return day(1, '%m/%d/%Y');
  }

  if (time > 6 * HOUR) {
    return hour(1, '%m/%d/%Y, %I %p');
  }

  if (time > HOUR) {
    return minute(30, '%H:%M');
  }

  if (time > 30 * MINUTE) {
    return minute(10, '%H:%M');
  }

  if (time > 10 * MINUTE) {
    return minute(5, '%H:%M');
  }

  if (time > MINUTE) {
    return minute(1, '%H:%M');
  }

  return second(30, '%H:%M:%S');
};