'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeDataRelatedState = exports.clusterTimeObjects = exports.normalizeData = exports.computeBoundaries = exports.computeTicks = exports.setTicks = exports.computeDate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; 

var _d3Time = require('d3-time');

var _d3Array = require('d3-array');

var _d3TimeFormat = require('d3-time-format');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
      unitMs = void 0,
      span = void 0,
      format = void 0;
  var transformFn = function transformFn(date) {
    return date;
  };
  if (time > YEAR * 1000) {
    unit = _d3Time.timeYear;
    unitMs = YEAR;
    span = 500;
    format = '%Y';
    transformFn = function transformFn(date) {
      return date.setFullYear(date.getFullYear() - date.getFullYear() % 500);
    };
  } else if (time > YEAR * 500) {
    unit = _d3Time.timeYear;
    unitMs = YEAR;
    span = 250;
    format = '%Y';
    transformFn = function transformFn(date) {
      return date.setFullYear(date.getFullYear() - date.getFullYear() % 250);
    };
  } else if (time > YEAR * 250) {
    unit = _d3Time.timeYear;
    unitMs = YEAR;
    span = 50;
    format = '%Y';
    transformFn = function transformFn(date) {
      return date.setFullYear(date.getFullYear() - date.getFullYear() % 125);
    };
  } else if (time > YEAR * 100) {
    unit = _d3Time.timeYear;
    unitMs = YEAR;
    span = 25;
    format = '%Y';
    transformFn = function transformFn(date) {
      return date.setFullYear(date.getFullYear() - date.getFullYear() % 50);
    };
  } else if (time > YEAR * 50) {
    unit = _d3Time.timeYear;
    unitMs = YEAR;
    span = 10;
    format = '%Y';
    transformFn = function transformFn(date) {
      return date.setFullYear(date.getFullYear() - date.getFullYear() % 50);
    };
  } else if (time > YEAR * 20) {
    unit = _d3Time.timeYear;
    unitMs = YEAR;
    span = 5;
    format = '%Y';
    transformFn = function transformFn(date) {
      return date.setFullYear(date.getFullYear() - date.getFullYear() % 10);
    };
  } else if (time > YEAR * 10) {
    unit = _d3Time.timeYear;
    unitMs = YEAR;
    span = 2;
    format = '%Y';
    transformFn = function transformFn(date) {
      return date.setFullYear(date.getFullYear() - date.getFullYear() % 2);
    };
  } else if (time > YEAR * 3) {
    unit = _d3Time.timeYear;
    unitMs = YEAR;
    span = 1;
    format = '%Y';
  } else if (time > YEAR) {
    unit = _d3Time.timeMonth;
    unitMs = MONTH;
    span = 6;
    format = '%m/%Y';
    transformFn = function transformFn(date) {
      return date.setMonth(date.getMonth() - date.getMonth() % 6);
    };
  } else if (time > MONTH * 6) {
    unit = _d3Time.timeMonth;
    unitMs = MONTH;
    span = 1;
    format = '%m/%Y';
  } else if (time > MONTH) {
    unit = _d3Time.timeDay;
    unitMs = DAY;
    span = 15;
    format = '%m/%d/%Y';
    transformFn = function transformFn(date) {
      return date.setDate(date.getDate() - date.getDate() % 15);
    };
  } else if (time > 15 * DAY) {
    unit = _d3Time.timeDay;
    unitMs = DAY;
    span = 3;
    format = '%m/%d/%Y';
    transformFn = function transformFn(date) {
      return date.setDate(date.getDate() - date.getDate() % 3);
    };
  } else if (time > DAY) {
    unit = _d3Time.timeDay;
    unitMs = DAY;
    span = 1;
    format = '%m/%d/%Y';
  } else if (time > 6 * HOUR) {
    unit = _d3Time.timeHour;
    unitMs = HOUR;
    span = 1;
    format = '%m/%d/%Y %Hh';
  } else if (time > HOUR) {
    unit = _d3Time.timeMinute;
    unitMs = MINUTE;
    span = 30;
    format = '%m/%d/%Y %Hh %Mmin';
    transformFn = function transformFn(date) {
      return date.setMinutes(date.getMinutes() - date.getMinutes() % 30);
    };
  } else if (time > 30 * MINUTE) {
    unit = _d3Time.timeMinute;
    unitMs = MINUTE;
    span = 10;
    format = '%m/%d/%Y %Hh %Mmin';
    transformFn = function transformFn(date) {
      return date.setMinutes(date.getMinutes() - date.getMinutes() % 10);
    };
  } else if (time > 10 * MINUTE) {
    unit = _d3Time.timeMinute;
    unitMs = MINUTE;
    span = 5;
    format = '%m/%d/%Y %Hh%Mmin';
    transformFn = function transformFn(date) {
      return date.setMinutes(date.getMinutes() - date.getMinutes() % 5);
    };
  } else if (time > MINUTE) {
    unit = _d3Time.timeMinute;
    unitMs = MINUTE;
    span = 1;
    format = '%m/%d/%Y %Hh %Mmin';
  } else {
    unit = _d3Time.timeSecond;
    unitMs = SECOND;
    span = 10;
    format = '%m/%d/%Y %Hh %Mmin %Ss';
    transformFn = function transformFn(date) {
      return date.setSeconds(date.getSeconds() - date.getSeconds() % 10);
    };
  }

  return {
    unit: unit,
    unitMs: unitMs,
    span: span,
    format: format,
    transformFn: transformFn
  };
};

var computeTicks = exports.computeTicks = function computeTicks(minimumDateDisplay, maximumDateDisplay) {
  var interval = maximumDateDisplay - minimumDateDisplay;
  var ticksParams = setTicks(interval);
  var formatDate = (0, _d3TimeFormat.timeFormat)(ticksParams.format);
  var minimumDateRound = ticksParams.transformFn(ticksParams.unit.round(minimumDateDisplay));
  var maximumDateRound = ticksParams.unit.round(maximumDateDisplay);
  var ticks = ticksParams.unit.range(minimumDateRound, maximumDateRound, ticksParams.span);
  return ticks.filter(function (tick) {
    return tick.getTime() >= minimumDateDisplay;
  }).map(function (tick) {
    return {
      time: tick.getTime(),
      legend: formatDate(tick)
    };
  });
};

var computeBoundaries = exports.computeBoundaries = function computeBoundaries(data) {
  var minimumDate = (0, _d3Array.min)(data, function (d) {
    return d.startDate && d.startDate.getTime();
  });
  var maximumDate = (0, _d3Array.max)(data, function (d) {
    return d.endDate ? d.endDate && d.endDate.getTime() : d.startDate.getTime();
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

var normalizeData = exports.normalizeData = function normalizeData(inputData) {
  return inputData && inputData.main && inputData.main.map(function (d, id) {
    return _extends({}, d, {
      startDate: d.startDate && typeof d.startDate === 'string' ? new Date(d.startDate) : d.startDate,
      endDate: d.endDate && typeof d.endDate === 'string' ? new Date(d.endDate) : d.endDate,
      type: d.endDate ? 'period' : 'event',
      id: id
    });
  });
};

var clusterTimeObjects = exports.clusterTimeObjects = function clusterTimeObjects(data, timeBoundaries) {
  var inputPeriods = data.filter(function (d) {
    return d.type === 'period';
  });
  var inputEvents = data.filter(function (d) {
    return d.type === 'event';
  });
  var ambitus = timeBoundaries[1] - timeBoundaries[0];
  var padding = Math.pow(ambitus, 1) / Math.sqrt(data.length);
  var maxColumn = 1;
  var previous = void 0;
  var previousEvents = void 0;
  var previousPeriods = void 0;
  var visiblePeriods = inputPeriods.filter(function (obj) {
    return obj.startDate.getTime() > timeBoundaries[0] && obj.startDate.getTime() < timeBoundaries[1] || obj.endDate.getTime() > timeBoundaries[0] && obj.endDate.getTime() < timeBoundaries[1] || obj.startDate.getTime() < timeBoundaries[0] && obj.endDate.getTime() > timeBoundaries[1];
  });
  var finalPeriods = visiblePeriods.reduce(function (periods, period, index) {
    if (periods.length && index > 0) {
      previous = periods[index - 1];
      previousPeriods = periods.slice(0, index - 1);
    } else {
      period.column = 1;
      return [].concat(_toConsumableArray(periods), [period]);
    }
    var previousColumn = previous.column;
    var findPeriod = function findPeriod(previousPeriod) {
      return period.endDate > previousPeriod.startDate && period.startDate < previousPeriod.endDate;
    };

    var _loop = function _loop(i) {
      var slotTaken = previousPeriods.filter(function (p) {
        return p.column === i;
      }).find(findPeriod);
      if (slotTaken === undefined) {
        period.column = i;
        return 'break';
      }
    };

    for (var i = 0; i <= previousColumn; i++) {
      var _ret = _loop(i);

      if (_ret === 'break') break;
    }
    if (period.column === undefined) {
      maxColumn++;
      period.column = maxColumn;
    }

    return [].concat(_toConsumableArray(periods), [period]);
  }, []);
  var maxPeriodColumn = maxColumn;
  maxColumn = maxPeriodColumn + 1;
  var visibleEvents = inputEvents.filter(function (obj) {
    return obj.startDate.getTime() >= timeBoundaries[0] && obj.startDate.getTime() <= timeBoundaries[1];
  });
  var finalEvents = visibleEvents.reduce(function (events, event, index) {
    if (events.length && index > 0) {
      previous = events[index - 1];
      previousEvents = events.slice(0, index - 1);
    } else {
      event.column = maxPeriodColumn + 1;
      return [].concat(_toConsumableArray(events), [event]);
    }
    var findEvent = function findEvent(previousEvent) {
      return Math.abs(event.startDate.getTime() - previousEvent.startDate.getTime()) < padding;
    };

    var _loop2 = function _loop2(i) {
      var slotTaken2 = previousEvents.filter(function (p) {
        return p.column === i;
      }).find(findEvent);
      if (slotTaken2 === undefined) {
        event.column = i;
        return 'break';
      }
    };

    for (var i = maxPeriodColumn + 1; i <= maxColumn; i++) {
      var _ret2 = _loop2(i);

      if (_ret2 === 'break') break;
    }
    if (event.column === undefined) {
      maxColumn++;
      event.column = maxColumn;
    }

    return [].concat(_toConsumableArray(events), [event]);
  }, []);

  var spatializedData = finalPeriods.concat(finalEvents);
  var following = void 0;
  var overflow = void 0;
  var labeledData = spatializedData.map(function (timeObject, index) {
    var availableColumns = 1;
    following = spatializedData.slice(index + 1);
    overflow = following.find(function (timeObject2) {
      return timeObject.column === timeObject2.column && Math.abs(timeObject2.startDate.getTime() - timeObject.startDate.getTime()) < padding;
    });
    if (overflow) {
    } else {
      var _loop3 = function _loop3(i) {
        overflow = following.find(function (other) {
          return other.column === i && other.endDate === undefined && other.startDate.getTime() - timeObject.startDate.getTime() < padding || other.endDate !== undefined && other.startDate.getTime() <= timeObject.startDate.getTime() && other.endDate.getTime() > timeObject.startDate.getTime();
        });
        if (overflow) {
          return 'break';
        } else {
          availableColumns++;
        }
      };

      for (var i = timeObject.column + 1; i <= maxColumn; i++) {
        var _ret3 = _loop3(i);

        if (_ret3 === 'break') break;
      }
    }
    return _extends({}, timeObject, {
      availableColumns: availableColumns
    });
  });
  return labeledData;
};

var computeDataRelatedState = exports.computeDataRelatedState = function computeDataRelatedState(inputData, viewParameters) {
  var data = inputData && inputData.main && inputData.main.map(function (d, id) {
    return _extends({}, d, {
      startDate: d.startDate && typeof d.startDate === 'string' ? new Date(d.startDate) : d.startDate,
      endDate: d.endDate && typeof d.endDate === 'string' ? new Date(d.endDate) : d.endDate,
      type: d.endDate ? 'period' : 'event',
      id: id
    });
  });
  var timeBoundaries = computeBoundaries(data);
  return {
    timeBoundaries: timeBoundaries,
    data: data,
    viewParameters: viewParameters
  };
};