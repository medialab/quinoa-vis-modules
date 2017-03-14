/**
 * This module consumes normalized data with a data map to build ready-to-visualize data
 * @module utils/timelineDataMapper
 */

import {
  timeYear,
  timeMonth,
  // timeWeek, // not used so far
  timeDay,
  timeHour,
  timeMinute,
  timeSecond
  // timeMillisecond // not used so far
} from 'd3-time';

// import {min, max} from 'd3-array';
// import {scaleLinear} from 'd3-scale';
// import {timeFormat} from 'd3-time-format';

/**
 * timerelated constants
 */
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
// const WEEK = DAY * 7; // not used so far
const MONTH = DAY * 31;
const YEAR = DAY * 365;

/**
 * Computes data's discretised date values to a javascript date object
 * @param {number} thatYear - year as a number
 * @param {number} thatMonth - month (1-12)
 * @param {number} thatDay - day of month (1-31)
 * @param {string} time - time as a ':'-separated string (e.g. 12:33:32)
 * @return {Date} newDate - converted date
 */
export const computeDate = (thatYear, thatMonth, thatDay, time) => {
  if (thatYear !== 0 && !thatYear) {
    return undefined;
  }

  const date = new Date();
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

  // computing time, taking into account different levels of precision
  // valid syntaxes :
  // 12:33:32
  // 12:33
  // 12
  if (time && typeof time === 'string') {
    const vals = time.split(':');

    if (vals.length > 0 && +vals[0] >= 0 && +vals[0] < 24) {
      date.setHours(vals.shift());
    }
 else {
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
    }

    if (vals.length > 0 && +vals[0] >= 0 && +vals[0] < 60) {
      date.setMinutes(vals.shift());
    }
 else {
      date.setMinutes(0);
      date.setSeconds(0);
    }

    if (vals.length > 0 && +vals[0] >= 0 && +vals[0] < 60) {
      date.setSeconds(vals.shift());
    }
 else {
      date.setSeconds(0);
    }
  }
 else {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
  }
  return date;
};

/**
 * Maps incoming data with provided data map
 * @param {object} normalizedData - incoming data made of of nodes and edges arrays
 * @param {object} dataMap - list of correspondance between output data needs and input data key names / accessors fns
 * @return {object} newData - ready-to-be-used data (array of objects)
 */
export default function mapData (normalizedData = {main: []}, inputDataMap = {main: {}}) {
  const data = normalizedData.main;
  const dataMap = inputDataMap.main;

  return {
    main: data.map(datapoint => {
      return Object.keys(dataMap).reduce((obj, dataKey) => {
        return {
          ...obj,
          [dataKey]: (typeof dataMap[dataKey] === 'function')
                     ? dataMap[dataKey](datapoint) // case accessor
                     : datapoint[dataMap[dataKey]] // case prop name
        };
      }, {});
    })
    // compute dates (timeline specific)
    .map(datapoint => {
      const {
        year,
        month,
        day,
        time,
        endYear = datapoint['end year'],
        endMonth = datapoint['end month'],
        endDay = datapoint['end day'],
        endTime = datapoint['end time']
      } = datapoint;

      const startDate = computeDate(year, month, day, time);
      const endDate = computeDate(endYear, endMonth, endDay, endTime);

      return {
        ...datapoint,
        startDate,
        endDate
      };
    })
    // sort by ascending date
    .sort((a, b) => {
      if (a.startDate.getTime() > b.startDate.getTime()) {
        return 1;
      }
      return -1;
    })};
}

/**
 * Computes data's discretised date values to a javascript date object
 * @param {number} time - time span to analyze
 * @return {object} utils - proper unit, proper ticks timespan, and proper date formatting pattern
 */
export const setTicks = function (time) {
  const timeVars = (unit, span, format) => {
    return {unit, span, format};
  };

  const year = (span, format) => timeVars(timeYear, span, format);
  const month = (span, format) => timeVars(timeMonth, span, format);
  const day = (span, format) => timeVars(timeDay, span, format);
  const hour = (span, format) => timeVars(timeHour, span, format);
  const minute = (span, format) => timeVars(timeMinute, span, format);
  const second = (span, format) => timeVars(timeSecond, span, format);

  // > 1000 years
  if (time > YEAR * 1000) {
    return year(500, '%Y');
  }

  // > 500 years
  if (time > YEAR * 500) {
    return year(250, '%Y');
  }

  // > 250 years
  if (time > YEAR * 250) {
    return year(125, '%Y');
  }

  // > 50 years
  if (time > YEAR * 100) {
    return year(50, '%Y');
  }

  //10 - 50 years
  if (time > YEAR * 10) {
    return year(10, '%Y');
  }

  // 3-10 years
  if (time > YEAR * 3) {
    return year(1, '%Y');
  }

  // 1-3 years
  if (time > YEAR) {
    return month(6, '%m/%Y');
  }

  // 6-12 months
  if (time > MONTH * 6) {
    return month(1, '%m/%Y');
  }

  // 1-6 months
  if (time > MONTH) {
    return day(15, '%m/%d/%Y');
  }

  // 15-30 days
  if (time > 15 * DAY) {
    return day(3, '%m/%d/%Y');
  }

  // 1-15 days
  if (time > DAY) {
    return day(1, '%m/%d/%Y');
  }

  // 6-24 hours
  if (time > 6 * HOUR) {
    return hour(1, '%m/%d/%Y, %I %p');
  }

  // 1-6 hours
  if (time > HOUR) {
    return minute(30, '%H:%M');
  }

  // 30-60 minutes
  if (time > 30 * MINUTE) {
    return minute(10, '%H:%M');
  }

  // 10-30 minutes
  if (time > 10 * MINUTE) {
    return minute(5, '%H:%M');
  }

  // 1-10 minutes
  if (time > MINUTE) {
    return minute(1, '%H:%M');
  }

  return second(30, '%H:%M:%S');
};
