'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Array = require('d3-array');

var _d3Scale = require('d3-scale');

var _d3TimeFormat = require('d3-time-format');

var _lodash = require('lodash');

var _utils = require('./utils');

var _subComponents = require('./subComponents.js');

require('./Timeline.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.mapData = _this.mapData.bind(_this);
    _this.computeBoundaries = _this.computeBoundaries.bind(_this);
    _this.pan = _this.pan.bind(_this);
    _this.zoom = _this.zoom.bind(_this);
    _this.computePeriods = _this.computePeriods.bind(_this);
    _this.onViewChange = (0, _lodash.debounce)(_this.onViewChange, 100);

    // data time boundaries in order to display the mini-timeline
    _this.timeBoundaries = {
      // absolute minimum date
      minimumDate: -Infinity,
      // absolute maximum date
      maximumDate: Infinity,
      // padded minimum date
      minimumDateDisplay: -Infinity,
      // padded maximum date
      maximumDateDisplay: Infinity
    };
    _this.viewParameters = props.viewParameters;
    _this.miniScale = (0, _d3Scale.scaleLinear)().range([0, 100]).domain([-Infinity, Infinity]);
    _this.mapData(_this.props.data, _this.props.viewParameters.dataMap);
    _this.periodsClusters = _this.computePeriods(_this.data);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      // remap data if data or datamap will change
      /*
      if (this.props.data !== nextProps.data || this.props.dataMap !== nextProps.dataMap) {
        this.mapData(nextProps.data, nextProps.dataMap);
      }
      */
      if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
        this.viewParameters = nextProps.viewParameters;
      }
    }
  }, {
    key: 'onViewChange',
    value: function onViewChange(lastEventType) {
      this.props.onViewChange({
        lastEventType: lastEventType,
        viewParameters: this.viewParameters
      });
    }
  }, {
    key: 'computePeriods',
    value: function computePeriods(data) {
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
        clustersColumns: clustersColumns,
        timeObjects: periodsClusters
      };
    }
  }, {
    key: 'pan',
    value: function pan(forward, delta) {
      this.viewParameters.toDate += forward ? delta : -delta;
      this.viewParameters.fromDate += forward ? delta : -delta;
      this.forceUpdate();
      this.onViewChange('wheel');
    }
  }, {
    key: 'zoom',
    value: function zoom(ratio) {
      var timeSpan = this.viewParameters.toDate - this.viewParameters.fromDate;
      var newTimeSpan = timeSpan / ratio;
      var diff = newTimeSpan - timeSpan;
      var newFrom = this.viewParameters.fromDate - diff / 2;
      var newTo = this.viewParameters.toDate + diff / 2;
      if (newFrom >= this.timeBoundaries.minimumDateDisplay && newTo <= this.timeBoundaries.maximumDateDisplay) {
        this.viewParameters.fromDate = newFrom;
        this.viewParameters.toDate = newTo;
        this.forceUpdate();
      }
      this.onViewChange('zoom');
    }

    /*
     * Registers invariant timeline boundaries
     */

  }, {
    key: 'computeBoundaries',
    value: function computeBoundaries() {
      var minimumDate = (0, _d3Array.min)(this.data, function (d) {
        return d.startDate.getTime();
      });
      var maximumDate = (0, _d3Array.max)(this.data, function (d) {
        return d.endDate ? d.endDate.getTime() : d.startDate.getTime();
      });
      // padding max and min of 1% of total time ambitus
      var ambitus = maximumDate - minimumDate;
      var displacement = ambitus / 100;
      var minimumDateDisplay = minimumDate - displacement;
      var maximumDateDisplay = maximumDate + displacement;
      this.timeBoundaries = {
        minimumDate: minimumDate,
        maximumDate: maximumDate,
        minimumDateDisplay: minimumDateDisplay,
        maximumDateDisplay: maximumDateDisplay
      };
      this.miniScale.domain([minimumDateDisplay, maximumDateDisplay]);
      this.miniTicks = (0, _utils.computeTicks)(minimumDateDisplay, maximumDateDisplay);
    }
    /*
     * Maps incoming data with provided data map
     */

  }, {
    key: 'mapData',
    value: function mapData(data, dataMap) {
      this.data = data.map(function (datapoint) {
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


        var startDate = (0, _utils.computeDate)(year, month, day, time);
        var endDate = (0, _utils.computeDate)(endYear, endMonth, endDay, endTime);
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
      this.computeBoundaries();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _props$allowViewChang = _props.allowViewChange,
          allowViewChange = _props$allowViewChang === undefined ? true : _props$allowViewChang,
          _props$orientation = _props.orientation,
          orientation = _props$orientation === undefined ? 'portrait' : _props$orientation;
      var data = this.data,
          miniScale = this.miniScale,
          miniTicks = this.miniTicks,
          viewParameters = this.viewParameters,
          periodsClusters = this.periodsClusters;

      var fromDate = viewParameters.fromDate instanceof Date ? viewParameters.fromDate.getTime() : viewParameters.fromDate;
      var toDate = viewParameters.toDate instanceof Date ? viewParameters.toDate.getTime() : viewParameters.toDate;
      var timeSpan = toDate - fromDate;
      var displayedData = data.filter(function (point) {
        var start = point.startDate.getTime();
        var end = point.endDate && point.endDate.getTime();
        return start >= fromDate && start <= toDate || end && end >= fromDate && end <= toDate;
      });
      var displayedEvents = displayedData.filter(function (obj) {
        return obj.endDate === undefined;
      });
      var eventPadding = timeSpan / 20;
      var eventsClusters = displayedEvents.reduce(function (periods, event) {
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
      var displayedPeriods = periodsClusters.timeObjects.filter(function (point) {
        var start = point.startDate.getTime();
        var end = point.endDate && point.endDate.getTime();
        return start >= fromDate && start <= toDate || end && end >= fromDate && end <= toDate;
      });
      var timelineScale = (0, _d3Scale.scaleLinear)().range([0, 100]).domain([fromDate, toDate]);
      var ticksParams = (0, _utils.setTicks)(toDate - fromDate);
      var formatDate = (0, _d3TimeFormat.timeFormat)(ticksParams.format);
      var mainTicks = (0, _utils.computeTicks)(fromDate, toDate);

      var onMainWheel = function onMainWheel(e) {
        e.stopPropagation();
        if (!_this2.props.allowViewChange) {
          return;
        }
        var delta = (toDate - fromDate) / 10;
        var forward = e.deltaY > 0;
        if (forward && toDate + delta <= _this2.timeBoundaries.maximumDateDisplay) {
          _this2.pan(true, delta);
        }
        if (!forward && fromDate - delta >= _this2.timeBoundaries.minimumDateDisplay) {
          _this2.pan(false, delta);
        }
      };

      var onAsideWheel = function onAsideWheel(e) {
        e.stopPropagation();
        if (!_this2.props.allowViewChange) {
          return;
        }
        var delta = (toDate - fromDate) / 2;
        var forward = e.deltaY > 0;
        if (forward && toDate + delta <= _this2.timeBoundaries.maximumDateDisplay) {
          _this2.pan(true, delta);
        }
        if (!forward && fromDate - delta >= _this2.timeBoundaries.minimumDateDisplay) {
          _this2.pan(false, delta);
        }
      };

      var zoomIn = function zoomIn() {
        return _this2.zoom(1.1);
      };
      var zoomOut = function zoomOut() {
        return _this2.zoom(0.9);
      };

      return _react2.default.createElement(
        'figure',
        { className: 'quinoa-timeline' + (orientation === 'portrait' ? ' portrait' : ' landscape') },
        _react2.default.createElement(
          'aside',
          { onWheel: onAsideWheel, className: 'mini-timeline' },
          _react2.default.createElement(_subComponents.TimeTicks, { ticks: miniTicks, scale: miniScale }),
          _react2.default.createElement('div', {
            className: 'brush',
            style: {
              top: miniScale(fromDate) + '%',
              height: miniScale(toDate) - miniScale(fromDate) + '%'
            } }),
          _react2.default.createElement(
            'div',
            { className: 'time-objects-container' },
            data.map(function (point, index) {
              return _react2.default.createElement(_subComponents.TimeObject, { scale: miniScale, point: point, key: index });
            })
          )
        ),
        _react2.default.createElement(
          'section',
          { className: 'main-timeline', onWheel: onMainWheel },
          _react2.default.createElement(_subComponents.TimeTicks, { ticks: mainTicks, scale: timelineScale }),
          _react2.default.createElement(
            'div',
            { className: 'time-objects-container' },
            displayedPeriods.length ? _react2.default.createElement(
              'div',
              { className: 'columns-container' },
              periodsClusters.clustersColumns.map(function (column) {
                return _react2.default.createElement(
                  'div',
                  { key: column, className: 'objects-column' },
                  displayedPeriods.filter(function (obj) {
                    return obj.column === column;
                  }).map(function (obj, index) {
                    return _react2.default.createElement(_subComponents.TimeObject, {
                      key: index,
                      point: obj,
                      color: viewParameters.colorsMap[obj.category],
                      scale: timelineScale });
                  })
                );
              })
            ) : '',
            eventsClusters.timeObjects.length ? _react2.default.createElement(
              'div',
              { className: 'columns-container' },
              eventsClusters.columns.map(function (column) {
                return _react2.default.createElement(
                  'div',
                  { key: column, className: 'objects-column' },
                  eventsClusters.timeObjects.filter(function (obj) {
                    return obj.column === column;
                  }).map(function (obj, index) {
                    return _react2.default.createElement(_subComponents.TimeObject, {
                      key: index,
                      point: obj,
                      scale: timelineScale,
                      color: viewParameters.colorsMap[obj.category],
                      showLabel: !obj.overlapped });
                  })
                );
              })
            ) : ''
          ),
          allowViewChange ? _react2.default.createElement(_subComponents.Controls, {
            zoomIn: zoomIn,
            zoomOut: zoomOut }) : '',
          _react2.default.createElement(
            'div',
            { className: 'time-boundaries-container' },
            _react2.default.createElement(
              'div',
              { id: 'from-date' },
              formatDate(new Date(fromDate))
            ),
            _react2.default.createElement(
              'div',
              { id: 'to-date' },
              formatDate(new Date(toDate))
            )
          )
        )
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

Timeline.propTypes = {
  /*
   * Incoming data in json format
   */
  // data: PropTypes.array,
  /*
   * object describing the current view (some being exposed to user interaction like pan and pan params, others not - like Timeline spatialization algorithm for instance)
   */
  viewParameters: _react.PropTypes.shape({
    /*
     * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
     */
    dataMap: _react.PropTypes.shape({
      name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      category: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      year: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      month: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      day: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      time: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      endYear: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      endMonth: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      endDay: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      endTime: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func])
    }),
    fromDate: _react.PropTypes.oneOfType([_react.PropTypes.instanceOf(Date), _react.PropTypes.number]),
    toDate: _react.PropTypes.oneOfType([_react.PropTypes.instanceOf(Date), _react.PropTypes.number]),
    orientation: _react.PropTypes.oneOf(['landscape', 'portrait'])
  }),
  /*
   * boolean to specify whether the user can pan/pan/interact or not with the view
   */
  allowViewChange: _react.PropTypes.bool,
  /*
   * callback fn triggered when user changes view parameters, callbacks data about the triggering interaction and about the new view parameters
   */
  onViewChange: _react.PropTypes.func
};

exports.default = Timeline;