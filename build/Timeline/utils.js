'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeDataRelatedState = exports.computeBoundaries = exports.computeEvents = exports.computePeriods = exports.clusterEvents = exports.computeTicks = exports.setTicks = exports.computeDate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Series of timeline-related computing utils
                                                                                                                                                                                                                                                                   * @module Timeline
                                                                                                                                                                                                                                                                   */

var _d3Time = require('d3-time');

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d3TimeFormat = require('d3-time-format');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * timerelated constants
 */
var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
// const WEEK = DAY * 7; // not used so far
var MONTH = DAY * 31;
var YEAR = DAY * 365;

/**
 * Computes data's discretised date values to a javascript date object
 * @param {number} thatYear - year as a number
 * @param {number} thatMonth - month (1-12)
 * @param {number} thatDay - day of month (1-31)
 * @param {string} time - time as a ':'-separated string (e.g. 12:33:32)
 * @return {Date} newDate - converted date
 */
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

  // computing time, taking into account different levels of precision
  // valid syntaxes :
  // 12:33:32
  // 12:33
  // 12
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

/**
 * Computes data's discretised date values to a javascript date object
 * @param {number} time - time span to analyze
 * @return {object} utils - proper unit, proper ticks timespan, and proper date formatting pattern
 */
var setTicks = exports.setTicks = function setTicks(time) {
  var unit = void 0,
      span = void 0,
      format = void 0;
  if (time > YEAR * 1000) {
    // > 1000 years
    unit = _d3Time.timeYear;
    span = 500;
    format = '%Y';
  } else if (time > YEAR * 500) {
    // > 500 years
    unit = _d3Time.timeYear;
    span = 250;
    format = '%Y';
  } else if (time > YEAR * 250) {
    // > 250 years
    unit = _d3Time.timeYear;
    span = 125;
    format = '%Y';
  } else if (time > YEAR * 100) {
    // > 50 years
    unit = _d3Time.timeYear;
    span = 50;
    format = '%Y';
  } else if (time > YEAR * 10) {
    //10 - 50 years
    unit = _d3Time.timeYear;
    span = 10;
    format = '%Y';
  } else if (time > YEAR * 3) {
    // 3-10 years
    unit = _d3Time.timeYear;
    span = 1;
    format = '%Y';
  } else if (time > YEAR) {
    //1-3 years
    unit = _d3Time.timeMonth;
    span = 6;
    format = '%m/%Y';
  } else if (time > MONTH * 6) {
    //6-12 months
    unit = _d3Time.timeMonth;
    span = 1;
    format = '%m/%Y';
  } else if (time > MONTH) {
    //1-6 months
    unit = _d3Time.timeDay;
    span = 15;
    format = '%m/%d/%Y';
  } else if (time > 15 * DAY) {
    //15-30 days
    unit = _d3Time.timeDay;
    span = 3;
    format = '%m/%d/%Y';
  } else if (time > DAY) {
    //1-15 days
    unit = _d3Time.timeDay;
    span = 1;
    format = '%m/%d/%Y';
  } else if (time > 6 * HOUR) {
    //6-24 hours
    unit = _d3Time.timeHour;
    span = 1;
    format = '%m/%d/%Y, %I %p';
  } else if (time > HOUR) {
    //1-6 hours
    unit = _d3Time.timeMinute;
    span = 30;
    format = '%H:%M';
  } else if (time > 30 * MINUTE) {
    //30-60 minutes
    unit = _d3Time.timeMinute;
    span = 10;
    format = '%H:%M';
  } else if (time > 10 * MINUTE) {
    //10-30 minutes
    unit = _d3Time.timeMinute;
    span = 5;
    format = '%H:%M';
  } else if (time > MINUTE) {
    //1-10 minutes
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

/**
 * Computes clean and appropriate axis ticks fn of timespan
 * @param {number} minimumDateDisplay - begining of the timespan
 * @param {number} maximumDateDisplay - end of the timespan
 * @return {array} ticks - list of ticks with position in time and computed time indication (legend)
 */
var computeTicks = exports.computeTicks = function computeTicks(minimumDateDisplay, maximumDateDisplay) {
  var ticksParams = setTicks(maximumDateDisplay - minimumDateDisplay);
  var formatDate = (0, _d3TimeFormat.timeFormat)(ticksParams.format);
  // todo : find a better method than that to compute clean ticks
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

/**
 * Organizes a list of event objects into separate columns that optimize their spreading in space
 * @param {number} events - array of events
 * @param {number} eventPadding - time (in millisec) to use to decide whether two events are overlapping
 * @return {object} periods - object containing a of list events enriched with a column indication, and the list of columns
 */
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

/**
 * Organizes a list of periods objects into separate columns that optimize their spreading in space
 * @param {number} data - array of periods
 * @return {object} periods - object containing a of list periods enriched with a column indication, and the list of columns
 */
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

/**
 * Organizes a list of event objects into separate columns that optimize their spreading in space
 * @param {number} events - array of events
 * @param {number} eventPadding - time (in millisec) to use to decide whether two events are overlapping
 * @return {object} periods - object containing a of list events enriched with a column indication, and the list of columns
 */
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

/**
 * Computes invariant timeline boundaries
 * @param {array} data - list of time objects
 * @return {object} boundaries - cf
 */
var computeBoundaries = exports.computeBoundaries = function computeBoundaries(data) {
  var minimumDate = (0, _d3Array.min)(data, function (d) {
    return d.startDate.getTime();
  });
  var maximumDate = (0, _d3Array.max)(data, function (d) {
    return d.endDate ? d.endDate.getTime() : d.startDate.getTime();
  });
  // padding max and min of 1% of total time ambitus
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

/**
 * Maps incoming data with provided data map
 * @param {array} data - list of time objects
 * @param {object} dataMap - list of correspondance between output data needs and input data key names / accessors fns
 * @return {array} newData - ready-to-be-used data
 */
var mapData = function mapData(data, dataMap) {
  return data.map(function (datapoint) {
    return Object.keys(dataMap).reduce(function (obj, dataKey) {
      return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap[dataKey] === 'function' ? dataMap[dataKey](datapoint) // case accessor
      : datapoint[dataMap[dataKey]]));
    }, {});
  })
  // compute dates (timeline specific)
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
  // sort by ascending date
  .sort(function (a, b) {
    if (a.startDate.getTime() > b.startDate.getTime()) {
      return 1;
    } else return -1;
  });
};

/**
 * Compute multiple timeline-related representations and utils out of a couple of data+dataMap
 * @param {array} inputData - initial data
 * @param {object} dataMap - list of correspondance between output data needs and input data key names / accessors fns
 * @param {object} viewParameters - initial view parameters
 * @return {array} stateRepresentation - invariant timeline-related state elements to be used when initing / reloading data or dataMap into component
 */
var computeDataRelatedState = exports.computeDataRelatedState = function computeDataRelatedState(inputData, dataMap, viewParameters) {
  var data = mapData(inputData, dataMap);
  var timeBoundaries = computeBoundaries(data);
  var miniTicks = computeTicks(timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay);
  var displaceThreshold = (timeBoundaries.maximumDateDisplay - timeBoundaries.minimumDateDisplay) / 1000;
  // data time boundaries in order to display the mini-timeline
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