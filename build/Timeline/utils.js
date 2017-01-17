'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeDataRelatedState = exports.computeBoundaries = exports.computeEvents = exports.computePeriods = exports.clusterEvents = exports.computeTicks = exports.setTicks = exports.computeDate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; 

var _d3Time = require('d3-time');

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d3TimeFormat = require('d3-time-format');

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
  } else date.setMonth(0);

  if (thatDay) {
    date.setDate(thatDay);
  } else date.setDate(1);

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

var setTicks = exports.setTicks = function setTicks(time) {
  var unit = void 0,
      span = void 0,
      format = void 0;
  if (time > YEAR * 1000) {
    unit = _d3Time.timeYear;
    span = 500;
    format = '%Y';
  } else if (time > YEAR * 500) {
    unit = _d3Time.timeYear;
    span = 250;
    format = '%Y';
  } else if (time > YEAR * 250) {
    unit = _d3Time.timeYear;
    span = 125;
    format = '%Y';
  } else if (time > YEAR * 100) {
    unit = _d3Time.timeYear;
    span = 50;
    format = '%Y';
  } else if (time > YEAR * 10) {
    unit = _d3Time.timeYear;
    span = 10;
    format = '%Y';
  } else if (time > YEAR * 3) {
    unit = _d3Time.timeYear;
    span = 1;
    format = '%Y';
  } else if (time > YEAR) {
    unit = _d3Time.timeMonth;
    span = 6;
    format = '%m/%Y';
  } else if (time > MONTH * 6) {
    unit = _d3Time.timeMonth;
    span = 1;
    format = '%m/%Y';
  } else if (time > MONTH) {
    unit = _d3Time.timeDay;
    span = 15;
    format = '%m/%d/%Y';
  } else if (time > 15 * DAY) {
    unit = _d3Time.timeDay;
    span = 3;
    format = '%m/%d/%Y';
  } else if (time > DAY) {
    unit = _d3Time.timeDay;
    span = 1;
    format = '%m/%d/%Y';
  } else if (time > 6 * HOUR) {
    unit = _d3Time.timeHour;
    span = 1;
    format = '%m/%d/%Y, %I %p';
  } else if (time > HOUR) {
    unit = _d3Time.timeMinute;
    span = 30;
    format = '%H:%M';
  } else if (time > 30 * MINUTE) {
    unit = _d3Time.timeMinute;
    span = 10;
    format = '%H:%M';
  } else if (time > 10 * MINUTE) {
    unit = _d3Time.timeMinute;
    span = 5;
    format = '%H:%M';
  } else if (time > MINUTE) {
    unit = _d3Time.timeMinute;
    span = 1;
    format = '%H:%M';
  } else {
    unit = _d3Time.timeSecond;
    span = 30;
    format = '%H:%M:%S';
  }

  return {
    unit: unit,
    span: span,
    format: format
  };
};

var computeTicks = exports.computeTicks = function computeTicks(minimumDateDisplay, maximumDateDisplay) {
  var ticksParams = setTicks(maximumDateDisplay - minimumDateDisplay);
  var formatDate = (0, _d3TimeFormat.timeFormat)(ticksParams.format);
  var baseDate = new Date();
  baseDate.setFullYear(-100000);
  baseDate.setDate(1);
  baseDate.setHours(0);
  baseDate.setMinutes(0);
  baseDate.setSeconds(0);
  baseDate.setMilliseconds(0);
  var ticks = ticksParams.unit.range(baseDate, maximumDateDisplay, ticksParams.span);
  return ticks.filter(function (tick) {
    return tick.getTime() >= minimumDateDisplay;
  }).map(function (tick) {
    return {
      time: tick.getTime(),
      legend: formatDate(tick)
    };
  });
};

var clusterEvents = exports.clusterEvents = function clusterEvents(events, eventPadding) {
  return events.reduce(function (periods, event) {
    var previous = void 0;
    if (periods.timeObjects.length) {
      previous = periods.timeObjects[periods.timeObjects.length - 1];
    }
    if (previous && event.startDate.getTime() - previous.startDate.getTime() < eventPadding) {
      event.column = previous.column + 1;
      previous.overlapped = true;
      event.overlapped = false;
      if (periods.columns[periods.columns.length - 1] < event.column) {
        periods.columns.push(event.column);
      }
    } else {
      event.column = 1;
    }
    periods.timeObjects.push(event);
    return periods;
  }, {
    timeObjects: [],
    columns: [1]
  });
};

var computePeriods = exports.computePeriods = function computePeriods(data) {
  var maxColumn = 1;
  var periodsClusters = data.filter(function (point) {
    return point.endDate !== undefined;
  });
  periodsClusters.forEach(function (period, index) {
    var previous = void 0;
    if (index > 0) {
      previous = periodsClusters[index - 1];
    }
    if (previous && period.startDate < previous.endDate) {
      period.column = previous.column + 1;
      previous.overlapped = true;
      period.overlapped = false;
      if (previous.column + 1 > maxColumn) {
        maxColumn = previous.column + 1;
      }
    } else {
      period.column = 1;
    }
  });
  var clustersColumns = [];
  for (var count = 0; count < maxColumn; count++) {
    clustersColumns.push(count + 1);
  }
  return {
    columns: clustersColumns,
    timeObjects: periodsClusters
  };
};

var computeEvents = exports.computeEvents = function computeEvents(data, thresholdTime) {
  var maxColumn = 1;
  var eventsClusters = data.filter(function (point) {
    return point.endDate === undefined;
  }).map(function (point) {
    return Object.assign({}, point);
  });
  eventsClusters.forEach(function (event, index) {
    var previous = void 0;
    if (index > 0) {
      previous = eventsClusters[index - 1];
    }
    if (previous && event.startDate - previous.startDate <= thresholdTime) {
      event.column = previous.column + 1;
      if (previous.column + 1 > maxColumn) {
        maxColumn = previous.column + 1;
      }
    } else {
      event.column = 1;
    }
  });
  var clustersColumns = [];
  for (var count = 0; count < maxColumn; count++) {
    clustersColumns.push(count + 1);
  }
  return {
    columns: clustersColumns,
    timeObjects: eventsClusters
  };
};

var computeBoundaries = exports.computeBoundaries = function computeBoundaries(data) {
  var minimumDate = (0, _d3Array.min)(data, function (d) {
    return d.startDate.getTime();
  });
  var maximumDate = (0, _d3Array.max)(data, function (d) {
    return d.endDate ? d.endDate.getTime() : d.startDate.getTime();
  });
  var ambitus = maximumDate - minimumDate;
  var displacement = ambitus / 100;
  var minimumDateDisplay = minimumDate - displacement;
  var maximumDateDisplay = maximumDate + displacement;
  return {
    minimumDate: minimumDate,
    maximumDate: maximumDate,
    minimumDateDisplay: minimumDateDisplay,
    maximumDateDisplay: maximumDateDisplay
  };
};

var mapData = function mapData(data, dataMap) {
  var dataStructure = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flatArray';

  if (dataStructure === 'flatArray') {
    return data.map(function (datapoint) {
      return Object.keys(dataMap).reduce(function (obj, dataKey) {
        return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap[dataKey] === 'function' ? dataMap[dataKey](datapoint) 
        : datapoint[dataMap[dataKey]]));
      }, {});
    })
    .map(function (datapoint) {
      var year = datapoint.year,
          month = datapoint.month,
          day = datapoint.day,
          time = datapoint.time;
      var endYear = datapoint.endYear,
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
      } else return -1;
    });
  } else {
    return data;
  }
};

var computeDataRelatedState = exports.computeDataRelatedState = function computeDataRelatedState(inputData, dataMap, viewParameters, dataStructure) {
  var data = mapData(inputData, dataMap, dataStructure);
  var timeBoundaries = computeBoundaries(data);
  var miniTicks = computeTicks(timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay);
  var displaceThreshold = (timeBoundaries.maximumDateDisplay - timeBoundaries.minimumDateDisplay) / 1000;
  return {
    timeBoundaries: timeBoundaries,
    miniTicks: miniTicks,
    data: data,
    viewParameters: viewParameters,
    miniScale: (0, _d3Scale.scaleLinear)().range([0, 100]).domain([timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay]),
    periodsClusters: computePeriods(data),
    eventsClusters: computeEvents(data, displaceThreshold)
  };
};