'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.computeTicks = exports.setTicks = exports.computeDate = undefined;

var _d3Time = require('d3-time');

var _d3TimeFormat = require('d3-time-format');

var second = 1000;
var minute = second * 60;
var hour = minute * 60;
var day = hour * 24;
// const week = day * 7;
var month = day * 31;
var year = day * 365;

/*
 * Computes data's discretised date values to a javascript date object
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
        date.setDate(day);
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

//I take a time span in absolute time format, return appropriate d3 ticks formatting settings
var setTicks = exports.setTicks = function setTicks(time) {
    var unit = void 0,
        span = void 0,
        format = void 0;
    if (time > year * 1000) {
        // > 1000 years
        unit = _d3Time.timeYear;
        span = 500;
        format = '%Y';
    } else if (time > year * 500) {
        // > 500 years
        unit = _d3Time.timeYear;
        span = 250;
        format = '%Y';
    } else if (time > year * 250) {
        // > 250 years
        unit = _d3Time.timeYear;
        span = 125;
        format = '%Y';
    } else if (time > year * 100) {
        // > 50 years
        unit = _d3Time.timeYear;
        span = 50;
        format = '%Y';
    } else if (time > year * 10) {
        //10 - 50 years
        unit = _d3Time.timeYear;
        span = 10;
        format = '%Y';
    } else if (time > year * 3) {
        // 3-10 years
        unit = _d3Time.timeYear;
        span = 1;
        format = '%Y';
    } else if (time > year) {
        //1-3 years
        unit = _d3Time.timeMonth;
        span = 6;
        //format = '%B %Y';
        format = '%m/%Y';
    } else if (time > month * 6) {
        //6-12 months
        unit = _d3Time.timeMonth;
        span = 1;
        //format = '%B %Y';
        format = '%m/%Y';
    } else if (time > month) {
        //1-6 months
        unit = _d3Time.timeDay;
        span = 15;
        //format = '%e %B %Y';
        format = '%m/%d/%Y';
    } else if (time > 15 * day) {
        //15-30 days
        unit = _d3Time.timeDay;
        span = 3;
        //format = '%e %B %Y';
        format = '%m/%d/%Y';
    } else if (time > day) {
        //1-15 days
        unit = _d3Time.timeDay;
        span = 1;
        //format = '%e %B %Y';
        format = '%m/%d/%Y';
    } else if (time > 6 * hour) {
        //6-24 hours
        unit = _d3Time.timeHour;
        span = 1;
        //format = '%e %B, %I %p';
        format = '%m/%d/%Y, %I %p';
    } else if (time > hour) {
        //1-6 hours
        unit = _d3Time.timeMinute;
        span = 30;
        format = '%H:%M';
    } else if (time > 30 * minute) {
        //30-60 minutes
        unit = _d3Time.timeMinute;
        span = 10;
        format = '%H:%M';
    } else if (time > 10 * minute) {
        //10-30 minutes
        unit = _d3Time.timeMinute;
        span = 5;
        format = '%H:%M';
    } else if (time > minute) {
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

/*
 * Computes clean and appropriate axis ticks fn of timespan
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