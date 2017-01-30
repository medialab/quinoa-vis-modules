/**
 * This module consumes normalized data with a data map to build ready-to-visualize data
 * @module utils/timelineDataMapper
 */

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

  thatMonth ? date.setMonth(thatMonth - 1) : date.setMonth(0);
  thatDay ? date.setDate(thatDay) : date.setDate(1);

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

  return data.map(datapoint => {
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
      endYear,
      endMonth,
      endDay,
      endTime
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
  });
}
