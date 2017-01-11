import {
    timeYear,
    timeMonth,
    // timeWeek,
    timeDay,
    timeHour,
    timeMinute,
    timeSecond
    // timeMillisecond
} from 'd3-time';

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
// const week = day * 7;
const month = day * 31;
const year = day * 365;

import {timeFormat} from 'd3-time-format';


/*
 * Computes data's discretised date values to a javascript date object
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
      date.setDate(day);
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


//I take a time span in absolute time format, return appropriate d3 ticks formatting settings
export const setTicks = function(time) {
    let unit, span, format;
    if (time > year * 1000) {// > 1000 years
        unit = timeYear;
        span = 500;
        format = '%Y';
    }

    else if (time > year * 500) {// > 500 years
        unit = timeYear;
        span = 250;
        format = '%Y';
    }
    else if (time > year * 250) {// > 250 years
        unit = timeYear;
        span = 125;
        format = '%Y';
    }
    else if (time > year * 100) {// > 50 years
        unit = timeYear;
        span = 50;
        format = '%Y';
    }
 else if (time > year * 10) {//10 - 50 years
        unit = timeYear;
        span = 10;
        format = '%Y';
    }
else if (time > year * 3) {// 3-10 years
        unit = timeYear;
        span = 1;
        format = '%Y';
    }
 else if (time > year) {//1-3 years
        unit = timeMonth;
        span = 6;
        //format = '%B %Y';
        format = '%m/%Y';
    }
else if (time > month * 6) {//6-12 months
        unit = timeMonth;
        span = 1;
        //format = '%B %Y';
        format = '%m/%Y';
    }
 else if (time > month) {//1-6 months
        unit = timeDay;
        span = 15;
        //format = '%e %B %Y';
        format = '%m/%d/%Y';
    }
else if (time > 15 * day) {//15-30 days
        unit = timeDay;
        span = 3;
        //format = '%e %B %Y';
        format = '%m/%d/%Y';

    }
else if (time > day) {//1-15 days
        unit = timeDay;
        span = 1;
        //format = '%e %B %Y';
        format = '%m/%d/%Y';

    }
 else if (time > 6 * hour) {//6-24 hours
        unit = timeHour;
        span = 1;
        //format = '%e %B, %I %p';
        format = '%m/%d/%Y, %I %p';

    }
else if (time > hour) {//1-6 hours
        unit = timeMinute;
        span = 30;
        format = '%H:%M';
    }
else if (time > 30 * minute) {//30-60 minutes
        unit = timeMinute;
        span = 10;
        format = '%H:%M';
    }
else if (time > 10 * minute) {//10-30 minutes
        unit = timeMinute;
        span = 5;
        format = '%H:%M';
    }
else if (time > minute) {//1-10 minutes
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

/*
 * Computes clean and appropriate axis ticks fn of timespan
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