'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _d3TimeFormat = require('d3-time-format');

var _lodash = require('lodash');

var _utils = require('./utils');

var _subComponents = require('./subComponents.js');

require('./Timeline.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.pan = _this.pan.bind(_this);
    _this.zoom = _this.zoom.bind(_this);
    _this.jump = _this.jump.bind(_this);
    _this.setViewSpan = _this.setViewSpan.bind(_this);
    _this.onUserViewChange = (0, _lodash.debounce)(_this.onUserViewChange, 100);
    _this.state = (0, _utils.computeDataRelatedState)(props.data, props.viewParameters.dataMap, props.viewParameters || {}, props.dataStructure);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
        this.setState({
          viewParameters: nextProps.viewParameters
        });
      }

      if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
        var newStateParts = (0, _utils.computeDataRelatedState)(nextProps.data, nextProps.viewParameters.dataMap, nextProps.viewParameters, nextProps.dataStructure);
        this.setState(_extends({}, newStateParts));
      }
    }


  }, {
    key: 'onUserViewChange',
    value: function onUserViewChange(lastEventType) {
      if (typeof this.props.onUserViewChange === 'function') {
        this.props.onUserViewChange({
          lastEventType: lastEventType,
          viewParameters: this.state.viewParameters
        });
      }
    }


  }, {
    key: 'pan',
    value: function pan(forward, delta) {
      var from = this.state.viewParameters.fromDate + (forward ? delta : -delta);
      var to = this.state.viewParameters.toDate + (forward ? delta : -delta);
      this.setViewSpan(from, to, false);
      this.onUserViewChange('wheel');
    }


  }, {
    key: 'zoom',
    value: function zoom(coefficient) {
      var timeSpan = this.state.viewParameters.toDate - this.state.viewParameters.fromDate;
      var newTimeSpan = timeSpan / coefficient;
      var diff = newTimeSpan - timeSpan;
      var newFrom = this.state.viewParameters.fromDate - diff / 2;
      var newTo = this.state.viewParameters.toDate + diff / 2;
      if (newFrom >= this.state.timeBoundaries.minimumDateDisplay && newTo <= this.state.timeBoundaries.maximumDateDisplay) {
        this.setViewSpan(newFrom, newTo, false);
        this.onUserViewChange('zoom');
      }
    }


  }, {
    key: 'jump',
    value: function jump(param) {
      var fromEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var toTime = void 0;
      if (fromEvent) {
        toTime = this.state.timeBoundaries.minimumDateDisplay + (this.state.timeBoundaries.maximumDateDisplay - this.state.timeBoundaries.minimumDateDisplay) * param.portionY;
      }
      else {
          toTime = param;
        }
      var span = this.state.viewParameters.toDate - this.state.viewParameters.fromDate;
      this.setViewSpan(toTime - span / 2, toTime + span / 2, false);
    }

  }, {
    key: 'setViewSpan',
    value: function setViewSpan(from, to) {
      var fromEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var fromTime = void 0;
      var toTime = void 0;
      if (fromEvents) {
        fromTime = this.state.timeBoundaries.minimumDateDisplay + (this.state.timeBoundaries.maximumDateDisplay - this.state.timeBoundaries.minimumDateDisplay) * from.portionY;
        toTime = this.state.timeBoundaries.minimumDateDisplay + (this.state.timeBoundaries.maximumDateDisplay - this.state.timeBoundaries.minimumDateDisplay) * to.portionY;
      }
      else {
          fromTime = from;
          toTime = to;
        }
      var viewParameters = _extends({}, this.state.viewParameters, {
        fromDate: fromTime,
        toDate: toTime
      });
      this.setState({
        viewParameters: viewParameters
      });
    }


  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _props$allowUserViewC = _props.allowUserViewChange,
          allowUserViewChange = _props$allowUserViewC === undefined ? true : _props$allowUserViewC,
          _props$orientation = _props.orientation,
          orientation = _props$orientation === undefined ? 'portrait' : _props$orientation;
      var _state = this.state,
          data = _state.data,
          miniScale = _state.miniScale,
          miniTicks = _state.miniTicks,
          viewParameters = _state.viewParameters,
          periodsClusters = _state.periodsClusters,
          globalEventsClusters = _state.eventsClusters,
          timeBoundaries = _state.timeBoundaries;


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
      var eventsClusters = (0, _utils.clusterEvents)(displayedEvents, eventPadding);
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
        e.preventDefault();
        if (!_this2.props.allowUserViewChange) {
          return;
        }
        var delta = (toDate - fromDate) / 10;
        var forward = e.deltaY > 0;
        if (forward && toDate + delta <= _this2.state.timeBoundaries.maximumDateDisplay) {
          _this2.pan(true, delta);
        }
        if (!forward && fromDate - delta >= _this2.state.timeBoundaries.minimumDateDisplay) {
          _this2.pan(false, delta);
        }
      };
      var onAsideWheel = function onAsideWheel(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!_this2.props.allowUserViewChange) {
          return;
        }
        var delta = (toDate - fromDate) / 2;
        var forward = e.deltaY > 0;
        if (forward && toDate + delta <= timeBoundaries.maximumDateDisplay) {
          _this2.pan(true, delta);
        }
        if (!forward && fromDate - delta >= timeBoundaries.minimumDateDisplay) {
          _this2.pan(false, delta);
        }
      };
      var zoomIn = function zoomIn() {
        return _this2.zoom(1.1);
      };
      var zoomOut = function zoomOut() {
        return _this2.zoom(0.9);
      };
      var panBackward = function panBackward() {
        return _this2.pan(false, (toDate - fromDate) / 10);
      };
      var panForward = function panForward() {
        return _this2.pan(true, (toDate - fromDate) / 10);
      };

      var onBrushClick = function onBrushClick(fromInput, toInput) {
        if (fromInput && toInput) {
          _this2.setViewSpan(fromInput, toInput);
        }
      };

      var onBrushManipulation = function onBrushManipulation(from, to) {
        _this2.setViewSpan(from, to, false);
      };

      return _react2.default.createElement(
        'figure',
        { className: 'quinoa-timeline' + (orientation === 'portrait' ? ' portrait' : ' landscape') },
        _react2.default.createElement(
          'aside',
          { onWheel: onAsideWheel, className: 'mini-timeline' },
          _react2.default.createElement(_subComponents.TimeTicks, { ticks: miniTicks, scale: miniScale }),
          _react2.default.createElement(_subComponents.Brush, {
            onSimpleClick: this.jump,
            scale: miniScale,
            fromDate: viewParameters.fromDate,
            toDate: viewParameters.toDate,
            active: allowUserViewChange,
            onSpanEventDefinition: onBrushClick,
            onSpanAbsoluteDefinition: onBrushManipulation }),
          _react2.default.createElement(
            'div',
            { className: 'time-objects-container' },
            _react2.default.createElement(_subComponents.ClustersGroup, {
              viewParameters: viewParameters,
              scale: miniScale,
              clusters: periodsClusters }),
            _react2.default.createElement(_subComponents.ClustersGroup, {
              viewParameters: viewParameters,
              scale: miniScale,
              clusters: globalEventsClusters })
          )
        ),
        _react2.default.createElement(
          'section',
          { className: 'main-timeline', onWheel: onMainWheel },
          _react2.default.createElement(_subComponents.TimeTicks, { ticks: mainTicks, scale: timelineScale }),
          _react2.default.createElement(
            'div',
            { className: 'time-objects-container' },
            displayedPeriods.length ? _react2.default.createElement(_subComponents.ClustersGroup, {
              viewParameters: viewParameters,
              scale: timelineScale,
              clusters: {
                columns: periodsClusters.columns,
                timeObjects: displayedPeriods
              } }) : '',
            eventsClusters.timeObjects.length ? _react2.default.createElement(_subComponents.ClustersGroup, {
              viewParameters: viewParameters,
              scale: timelineScale,
              clusters: eventsClusters }) : ''
          ),
          allowUserViewChange ? _react2.default.createElement(_subComponents.Controls, {
            zoomIn: zoomIn,
            zoomOut: zoomOut,
            panForward: panForward,
            panBackward: panBackward }) : '',
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
  dataStructure: _react.PropTypes.oneOf(['flatArray']),
  viewParameters: _react.PropTypes.shape({
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
    orientation: _react.PropTypes.oneOf(['landscape', 'portrait']).required
  }),
  allowUserViewChange: _react.PropTypes.bool,
  onUserViewChange: _react.PropTypes.func
};

exports.default = Timeline;