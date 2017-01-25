/**
 * Series of timeline-related computing utils
 * @module Timeline
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

import {min, max} from 'd3-array';
import {scaleLinear} from 'd3-scale';

/*
 * timerelated constants
 */
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
// const WEEK = DAY * 7; // not used so far
const MONTH = DAY * 31;
const YEAR = DAY * 365;

import {timeFormat} from 'd3-time-format';


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
    }
 else date.setMonth(0);

    if (thatDay) {
      date.setDate(thatDay);
    }
 else date.setDate(1);

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
 * Computes data's discretised date values to a javascript date object
 * @param {number} time - time span to analyze
 * @return {object} utils - proper unit, proper ticks timespan, and proper date formatting pattern
 */
export const setTicks = function(time) {
    let unit, span, format;
    if (time > YEAR * 1000) {// > 1000 years
        unit = timeYear;
        span = 500;
        format = '%Y';
    }

    else if (time > YEAR * 500) {// > 500 years
        unit = timeYear;
        span = 250;
        format = '%Y';
    }
    else if (time > YEAR * 250) {// > 250 years
        unit = timeYear;
        span = 125;
        format = '%Y';
    }
    else if (time > YEAR * 100) {// > 50 years
        unit = timeYear;
        span = 50;
        format = '%Y';
    }
 else if (time > YEAR * 10) {//10 - 50 years
        unit = timeYear;
        span = 10;
        format = '%Y';
    }
else if (time > YEAR * 3) {// 3-10 years
        unit = timeYear;
        span = 1;
        format = '%Y';
    }
 else if (time > YEAR) {//1-3 years
        unit = timeMonth;
        span = 6;
        format = '%m/%Y';
    }
else if (time > MONTH * 6) {//6-12 months
        unit = timeMonth;
        span = 1;
        format = '%m/%Y';
    }
 else if (time > MONTH) {//1-6 months
        unit = timeDay;
        span = 15;
        format = '%m/%d/%Y';
    }
else if (time > 15 * DAY) {//15-30 days
        unit = timeDay;
        span = 3;
        format = '%m/%d/%Y';

    }
else if (time > DAY) {//1-15 days
        unit = timeDay;
        span = 1;
        format = '%m/%d/%Y';

    }
 else if (time > 6 * HOUR) {//6-24 hours
        unit = timeHour;
        span = 1;
        format = '%m/%d/%Y, %I %p';

    }
else if (time > HOUR) {//1-6 hours
        unit = timeMinute;
        span = 30;
        format = '%H:%M';
    }
else if (time > 30 * MINUTE) {//30-60 minutes
        unit = timeMinute;
        span = 10;
        format = '%H:%M';
    }
else if (time > 10 * MINUTE) {//10-30 minutes
        unit = timeMinute;
        span = 5;
        format = '%H:%M';
    }
else if (time > MINUTE) {//1-10 minutes
        unit = timeMinute;
        span = 1;
        format = '%H:%M';
    }
 else {
        unit = timeSecond;
        span = 30;
        format = '%H:%M:%S';
    }

    return {
        unit,
        span,
        format
    };
};


/**
 * Computes clean and appropriate axis ticks fn of timespan
 * @param {number} minimumDateDisplay - begining of the timespan
 * @param {number} maximumDateDisplay - end of the timespan
 * @return {array} ticks - list of ticks with position in time and computed time indication (legend)
 */
export const computeTicks = (minimumDateDisplay, maximumDateDisplay) => {
    const ticksParams = setTicks(maximumDateDisplay - minimumDateDisplay);
    const formatDate = timeFormat(ticksParams.format);
    // todo : find a better method than that to compute clean ticks
    const baseDate = new Date();
    baseDate.setFullYear(-100000);
    baseDate.setDate(1);
    baseDate.setHours(0);
    baseDate.setMinutes(0);
    baseDate.setSeconds(0);
    baseDate.setMilliseconds(0);
    const ticks = ticksParams.unit.range(baseDate, maximumDateDisplay, ticksParams.span);
    return ticks
        .filter(tick => tick.getTime() >= minimumDateDisplay)
        .map(tick => ({
          time: tick.getTime(),
          legend: formatDate(tick)
        }));
};

/**
 * Organizes a list of event objects into separate columns that optimize their spreading in space
 * @param {number} events - array of events
 * @param {number} eventPadding - time (in millisec) to use to decide whether two events are overlapping
 * @return {object} periods - object containing a of list events enriched with a column indication, and the list of columns
 */
export const clusterEvents = (events, eventPadding) =>
    events
      .reduce((periods, event) => {
        let previous;
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
        }
        else {
          event.column = 1;
        }
        periods.timeObjects.push(event);
        return periods;
      }, {
        timeObjects: [],
        columns: [1]
      });

/**
 * Organizes a list of periods objects into separate columns that optimize their spreading in space
 * @param {number} data - array of periods
 * @return {object} periods - object containing a of list periods enriched with a column indication, and the list of columns
 */
export const computePeriods = (data) => {
    let maxColumn = 1;
    const periodsClusters = data.filter(point => point.endDate !== undefined);
    periodsClusters.forEach((period, index) => {
      let previous;
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
      }
      else {
        period.column = 1;
      }
    });
    const clustersColumns = [];
    for (let count = 0; count < maxColumn; count ++) {
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
export const computeEvents = (data, thresholdTime) => {
    let maxColumn = 1;
    const eventsClusters = data.filter(point => point.endDate === undefined).map(point => Object.assign({}, point));
    eventsClusters.forEach((event, index) => {
      let previous;
      if (index > 0) {
        previous = eventsClusters[index - 1];
      }
      if (previous && event.startDate - previous.startDate <= thresholdTime) {
        event.column = previous.column + 1;
        if (previous.column + 1 > maxColumn) {
          maxColumn = previous.column + 1;
        }
      }
      else {
        event.column = 1;
      }
    });
    const clustersColumns = [];
    for (let count = 0; count < maxColumn; count ++) {
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
export const computeBoundaries = (data) => {
    const minimumDate = min(data, (d) => d.startDate.getTime());
    const maximumDate = max(data, (d) => {
      return d.endDate ? d.endDate.getTime() : d.startDate.getTime();
    });
    // padding max and min of 1% of total time ambitus
    const ambitus = maximumDate - minimumDate;
    const displacement = ambitus / 100;
    const minimumDateDisplay = (minimumDate - displacement);
    const maximumDateDisplay = (maximumDate + displacement);
    return {
      minimumDate,
      maximumDate,
      minimumDateDisplay,
      maximumDateDisplay
    };
   };

/**
 * Compute multiple timeline-related representations and utils out of a couple of data+dataMap
 * @param {array} data - initial data
 * @param {object} viewParameters - initial view parameters
 * @return {array} stateRepresentation - invariant timeline-related state elements to be used when initing / reloading data or dataMap into component
 */
export const computeDataRelatedState = (data, viewParameters) => {
    const timeBoundaries = computeBoundaries(data);
    const miniTicks = computeTicks(timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay);
    const displaceThreshold = (timeBoundaries.maximumDateDisplay - timeBoundaries.minimumDateDisplay) / 1000;
    // data time boundaries in order to display the mini-timeline
    return {
      timeBoundaries,
      miniTicks,
      data,
      viewParameters,
      miniScale: scaleLinear().range([0, 100]).domain([timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay]),
      periodsClusters: computePeriods(data),
      eventsClusters: computeEvents(data, displaceThreshold)
    };
};
