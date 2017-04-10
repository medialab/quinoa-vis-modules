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
    timeSecond, // not used so far
    // timeMillisecond // not used so far
} from 'd3-time';

import {min, max} from 'd3-array';

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
    let unit, unitMs, span, format;
    let transformFn = (date) => date;
    if (time > YEAR * 1000) {// > 1000 years
        unit = timeYear;
        unitMs = YEAR;
        span = 500;
        format = '%Y';
        transformFn = (date) => date.setFullYear(date.getFullYear() - date.getFullYear() % 500);
    }

    else if (time > YEAR * 500) {// > 500 years
        unit = timeYear;
        unitMs = YEAR;
        span = 250;
        format = '%Y';
        transformFn = (date) => date.setFullYear(date.getFullYear() - date.getFullYear() % 250);
    }
    else if (time > YEAR * 250) {// > 250 years
        unit = timeYear;
        unitMs = YEAR;
        span = 50;
        format = '%Y';
        transformFn = (date) => date.setFullYear(date.getFullYear() - date.getFullYear() % 125);
    }
    else if (time > YEAR * 100) {// > 100 years
        unit = timeYear;
        unitMs = YEAR;
        span = 25;
        format = '%Y';
        transformFn = (date) => date.setFullYear(date.getFullYear() - date.getFullYear() % 50);
    }
    else if (time > YEAR * 50) {// > 50 years
        unit = timeYear;
        unitMs = YEAR;
        span = 10;
        format = '%Y';
        transformFn = (date) => date.setFullYear(date.getFullYear() - date.getFullYear() % 50);
    }
 else if (time > YEAR * 20) {//20 - 50 years
        unit = timeYear;
        unitMs = YEAR;
        span = 5;
        format = '%Y';
        transformFn = (date) => date.setFullYear(date.getFullYear() - date.getFullYear() % 10);
    }
  else if (time > YEAR * 10) {//10 - 20 years
        unit = timeYear;
        unitMs = YEAR;
        span = 2;
        format = '%Y';
        transformFn = (date) => date.setFullYear(date.getFullYear() - date.getFullYear() % 2);
    }
 else if (time > YEAR * 3) {//3-10 years
        unit = timeYear;
        unitMs = YEAR;
        span = 1;
        format = '%Y';
    }
 else if (time > YEAR) {//1-3 years
        unit = timeMonth;
        unitMs = MONTH;
        span = 6;
        format = '%m/%Y';
        transformFn = (date) => date.setMonth(date.getMonth() - date.getMonth() % 6);
    }
else if (time > MONTH * 6) {//6-12 months
        unit = timeMonth;
        unitMs = MONTH;
        span = 1;
        format = '%m/%Y';
    }
 else if (time > MONTH) {//1-6 months
        unit = timeDay;
        unitMs = DAY;
        span = 15;
        format = '%m/%d/%Y';
        transformFn = (date) => date.setDate(date.getDate() - date.getDate() % 15);
    }
else if (time > 15 * DAY) {//15-30 days
        unit = timeDay;
        unitMs = DAY;
        span = 3;
        format = '%m/%d/%Y';
        transformFn = (date) => date.setDate(date.getDate() - date.getDate() % 3);
    }
else if (time > DAY) {//1-15 days
        unit = timeDay;
        unitMs = DAY;
        span = 1;
        format = '%m/%d/%Y';
    }
 else if (time > 6 * HOUR) {//6-24 hours
        unit = timeHour;
        unitMs = HOUR;
        span = 1;
        format = '%m/%d/%Y %Hh';
    }
else if (time > HOUR) {//1-6 hours
        unit = timeMinute;
        unitMs = MINUTE;
        span = 30;
        format = '%m/%d/%Y %Hh %Mmin';
        transformFn = (date) => date.setMinutes(date.getMinutes() - date.getMinutes() % 30);
    }
else if (time > 30 * MINUTE) {//30-60 minutes
        unit = timeMinute;
        unitMs = MINUTE;
        span = 10;
        format = '%m/%d/%Y %Hh %Mmin';
        transformFn = (date) => date.setMinutes(date.getMinutes() - date.getMinutes() % 10);
    }
else if (time > 10 * MINUTE) {//10-30 minutes
        unit = timeMinute;
        unitMs = MINUTE;
        span = 5;
        format = '%m/%d/%Y %Hh%Mmin';
        transformFn = (date) => date.setMinutes(date.getMinutes() - date.getMinutes() % 5);
    }
else if (time > MINUTE) {//1-10 minutes
        unit = timeMinute;
        unitMs = MINUTE;
        span = 1;
        format = '%m/%d/%Y %Hh %Mmin';
    }
 else {
        // unit = timeSecond;
        // span = 30;
        // format = '%H:%M:%S';
        unit = timeSecond;
        unitMs = SECOND;
        span = 10;
        format = '%m/%d/%Y %Hh %Mmin %Ss';
        transformFn = (date) => date.setSeconds(date.getSeconds() - date.getSeconds() % 10);
    }

    return {
        unit,
        unitMs,
        span,
        format,
        transformFn
    };
};


/**
 * Computes clean and appropriate axis ticks fn of timespan
 * @param {number} minimumDateDisplay - begining of the timespan
 * @param {number} maximumDateDisplay - end of the timespan
 * @return {array} ticks - list of ticks with position in time and computed time indication (legend)
 */
export const computeTicks = (minimumDateDisplay, maximumDateDisplay) => {
    const interval = maximumDateDisplay - minimumDateDisplay;
    const ticksParams = setTicks(interval);
    const formatDate = timeFormat(ticksParams.format);
    // const minimumDateRound = ticksParams.unit.round(minimumDateDisplay) - ticksParams.unit.round(minimumDateDisplay)%(ticksParams.unitMs * ticksParams.span); // ticksParams.unit.ceil(minimumDateDisplay);
    const minimumDateRound = ticksParams.transformFn(ticksParams.unit.round(minimumDateDisplay));
    const maximumDateRound = ticksParams.unit.round(maximumDateDisplay);
    const ticks = ticksParams.unit.range(minimumDateRound, maximumDateRound, ticksParams.span);
    return ticks
        .filter(tick => tick.getTime() >= minimumDateDisplay)
        .map(tick => ({
          time: tick.getTime(),
          legend: formatDate(tick)
        }));
};

/**
 * Computes invariant timeline boundaries
 * @param {array} data - list of time objects
 * @return {object} boundaries - cf
 */
export const computeBoundaries = (data) => {
    const minimumDate = min(data, (d) => d.startDate && d.startDate.getTime());
    const maximumDate = max(data, (d) => {
      return d.endDate ? d.endDate && d.endDate.getTime() : d.startDate.getTime();
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
 * Improves received data by forcing each point to have an id, casting it as period or event, and ensuring dates are deserialized to date objects
 * @param {array} inputDate - the unnormalized data
 * @return {array} newDate - the normalized data
 */
export const normalizeData = (inputData) =>
  inputData && inputData.main &&
  inputData.main
  .map((d, id) => ({
    ...d,
    startDate: d.startDate && typeof d.startDate === 'string' ? new Date(d.startDate) : d.startDate,
    endDate: d.endDate && typeof d.endDate === 'string' ? new Date(d.endDate) : d.endDate,
    type: d.endDate ? 'period' : 'event',
    id
  }));

export const clusterTimeObjects = (data, timeBoundaries) => {
  const inputPeriods = data.filter(d => d.type === 'period');
  const inputEvents = data.filter(d => d.type === 'event');
  const ambitus = timeBoundaries[1] - timeBoundaries[0];
  const padding = Math.pow(ambitus, 1) / Math.sqrt(data.length);
  let maxColumn = 1;
  let previous;
  let previousEvents;
  let previousPeriods;
  // filter only periods within the display time boundaries
  const visiblePeriods = inputPeriods
  .filter(obj =>
    (
     obj.startDate.getTime() > timeBoundaries[0] &&
     obj.startDate.getTime() < timeBoundaries[1]
    ) ||
    (
      obj.endDate.getTime() > timeBoundaries[0] &&
      obj.endDate.getTime() < timeBoundaries[1]
    ) ||
    (
      obj.startDate.getTime() < timeBoundaries[0] &&
      obj.endDate.getTime() > timeBoundaries[1]
    )
  );
  const finalPeriods = visiblePeriods
  .reduce((periods, period, index) => {
    if (periods.length && index > 0) {
      previous = periods[index - 1];
      previousPeriods = periods.slice(0, index - 1);
    }
    else {
      period.column = 1;
      return [...periods, period];
    }
    const previousColumn = previous.column;
    const findPeriod = previousPeriod => period.endDate > previousPeriod.startDate && period.startDate < previousPeriod.endDate;
    for (let i = 0; i <= previousColumn; i++) {
      const slotTaken = previousPeriods
        .filter(p => p.column === i)
        .find(findPeriod);
      if (slotTaken === undefined) {
        period.column = i;
        break;
      }
    }
    if (period.column === undefined) {
      maxColumn ++;
      period.column = maxColumn;
    }

    return [...periods, period];
  }, []);
  const maxPeriodColumn = maxColumn;
  maxColumn = maxPeriodColumn + 1;
  // filter only periods within the display time boundaries
  const visibleEvents = inputEvents
  .filter(obj =>
      obj.startDate.getTime() >= timeBoundaries[0] &&
      obj.startDate.getTime() <= timeBoundaries[1]
    );
  const finalEvents = visibleEvents
  .reduce((events, event, index) => {
    if (events.length && index > 0) {
      previous = events[index - 1];
      previousEvents = events.slice(0, index - 1);
    }
    else {
      event.column = maxPeriodColumn + 1;
      return [...events, event];
    }
    const findEvent = previousEvent => Math.abs(event.startDate.getTime() - previousEvent.startDate.getTime()) < padding;
    for (let i = maxPeriodColumn + 1; i <= maxColumn; i++) {
      const slotTaken2 = previousEvents
        .filter(p => p.column === i)
        .find(findEvent);
      if (slotTaken2 === undefined) {
        event.column = i;
        break;
      }
    }
    if (event.column === undefined) {
      maxColumn ++;
      event.column = maxColumn;
    }

    return [...events, event];
  }, []);

  const spatializedData = finalPeriods.concat(finalEvents);
  let following;
  let overflow;
  /*
   * Calculating the available columns for displaying labels without overflows
   */
  const labeledData = spatializedData.map((timeObject, index) => {
    let availableColumns = 1;
    following = spatializedData.slice(index + 1);
    overflow = following.find(timeObject2 =>
      timeObject.column === timeObject2.column &&
      Math.abs(timeObject2.startDate.getTime() - timeObject.startDate.getTime()) < padding
    );
    if (overflow) {
      // availableColumns = 0;
    }
    else {
      for (let i = timeObject.column + 1; i <= maxColumn; i++) {
        overflow = following.find(other =>
          other.column === i &&
          (other.endDate === undefined && other.startDate.getTime() - timeObject.startDate.getTime() < padding) ||
          (other.endDate !== undefined && other.startDate.getTime() <= timeObject.startDate.getTime() && other.endDate.getTime() > timeObject.startDate.getTime())
        );
        if (overflow) {
          break;
        }
        else {
          availableColumns ++;
        }
      }
    }
    return {
      ...timeObject,
      availableColumns
    };
  });
  return labeledData;
};

/**
 * Compute multiple timeline-related representations and utils out of a couple of data+dataMap
 * @param {array} inputData - initial data
 * @param {object} viewParameters - initial view parameters
 * @return {array} stateRepresentation - invariant timeline-related state elements to be used when initing / reloading data or dataMap into component
 */
export const computeDataRelatedState = (inputData, viewParameters) => {
    const data = inputData && inputData.main && inputData.main.map((d, id) => ({
      ...d,
      startDate: d.startDate && typeof d.startDate === 'string' ? new Date(d.startDate) : d.startDate,
      endDate: d.endDate && typeof d.endDate === 'string' ? new Date(d.endDate) : d.endDate,
      type: d.endDate ? 'period' : 'event',
      id
    }));
    const timeBoundaries = computeBoundaries(data);
    return {
      timeBoundaries,
      data,
      viewParameters
    };
};
