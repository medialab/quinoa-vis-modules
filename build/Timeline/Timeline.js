'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Ease = require('d3-ease');

var _lodash = require('lodash');

var _utils = require('./utils');

require('./Timeline.scss');

var _MiniTimeline = require('./MiniTimeline');

var _MiniTimeline2 = _interopRequireDefault(_MiniTimeline);

var _MainTimeline = require('./MainTimeline');

var _MainTimeline2 = _interopRequireDefault(_MainTimeline);

var _d3Interpolate = require('d3-interpolate');

var _d3Timer = require('d3-timer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 

var transition = void 0;


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
    _this.state = (0, _utils.computeDataRelatedState)(props.data, props.viewParameters || {});
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (this.props.viewParameters !== nextProps.viewParameters) {
        (function () {
          var transitionsDuration = 500;
          var prevFrom = _this2.state.viewParameters.fromDate;
          var prevTo = _this2.state.viewParameters.toDate;
          var newFrom = nextProps.viewParameters.fromDate;
          var newTo = nextProps.viewParameters.toDate;
          var interpFrom = (0, _d3Interpolate.interpolateNumber)(prevFrom, newFrom);
          var interpTo = (0, _d3Interpolate.interpolateNumber)(prevTo, newTo);
          var onTick = function onTick(elapsed) {
            var t = elapsed < transitionsDuration ? (0, _d3Ease.easeCubic)(elapsed / transitionsDuration) : 1;
            var fromDate = interpFrom(t);
            var toDate = interpTo(t);
            _this2.setState({
              viewParameters: _extends({}, _this2.state.viewParameters, {
                fromDate: fromDate,
                toDate: toDate
              })
            });
            if (t >= 1 && transition) {
              transition.stop();
              transition = null;
            }
          };

          transition = (0, _d3Timer.timer)(onTick);

        })();
      }

      if (this.props.data !== nextProps.data) {
        var newStateParts = (0, _utils.computeDataRelatedState)(nextProps.data, nextProps.viewParameters);
        this.setState(_extends({}, newStateParts));
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (this.state.lastEventDate !== nextState.lastEventDate && typeof this.props.onUserViewChange === 'function') {
        this.props.onUserViewChange({
          lastEventType: nextState.lastEventType,
          viewParameters: nextState.viewParameters
        });
      }
    }


  }, {
    key: 'onUserViewChange',
    value: function onUserViewChange(newParameters, lastEventType) {
      this.setState({
        lastEventType: lastEventType,
        lastEventDate: new Date()
      });
    }


  }, {
    key: 'pan',
    value: function pan(forward, delta) {
      var from = this.state.viewParameters.fromDate + (forward ? delta : -delta);
      var to = this.state.viewParameters.toDate + (forward ? delta : -delta);
      if (from >= this.state.timeBoundaries.minimumDateDisplay && to <= this.state.timeBoundaries.maximumDateDisplay) {
        this.setViewSpan(from, to, false);
        this.onUserViewChange({
          fromDate: from,
          toDate: to
        }, 'wheel');
      }
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
        this.onUserViewChange({
          fromDate: newFrom,
          toDate: newTo
        }, 'zoom');
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
      var emitChange = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

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
      if (emitChange) {
        this.onUserViewChange({
          lastEventType: 'mini-view',
          viewParameters: viewParameters
        });
      }
      this.setState({
        viewParameters: viewParameters
      });
    }


  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          _props$allowUserViewC = _props.allowUserViewChange,
          allowUserViewChange = _props$allowUserViewC === undefined ? true : _props$allowUserViewC,
          _props$orientation = _props.orientation,
          orientation = _props$orientation === undefined ? 'portrait' : _props$orientation;
      var _state = this.state,
          data = _state.data,
          miniScale = _state.miniScale,
          viewParameters = _state.viewParameters,
          timeBoundaries = _state.timeBoundaries;

      return data ? _react2.default.createElement(
        'figure',
        { className: 'quinoa-timeline' + (orientation === 'portrait' ? ' portrait' : ' landscape') },
        _react2.default.createElement(_MiniTimeline2.default, {
          viewParameters: viewParameters,
          timeBoundaries: timeBoundaries,
          scale: miniScale,
          data: (0, _utils.normalizeData)(this.props.data),
          onTimespanUpdate: this.setViewSpan,
          allowUserEvents: allowUserViewChange }),
        _react2.default.createElement(_MainTimeline2.default, {
          viewParameters: viewParameters,
          scale: miniScale,
          data: (0, _utils.normalizeData)(this.props.data),
          onZoom: this.zoom,
          onPan: this.pan,
          allowUserEvents: allowUserViewChange,
          setViewSpan: this.setViewSpan })
      ) : 'Loading';
    }
  }]);

  return Timeline;
}(_react2.default.Component);

Timeline.propTypes = {
  data: _react.PropTypes.shape({
    main: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      category: _react.PropTypes.string,
      title: _react.PropTypes.string,
      name: _react.PropTypes.string,
      description: _react.PropTypes.string,
      startDate: _react.PropTypes.instanceOf(Date),
      endDate: _react.PropTypes.instanceOf(Date)
    }))
  }),
  viewParameters: _react.PropTypes.shape({
    fromDate: _react.PropTypes.oneOfType([_react.PropTypes.instanceOf(Date), _react.PropTypes.number]),
    toDate: _react.PropTypes.oneOfType([_react.PropTypes.instanceOf(Date), _react.PropTypes.number]),
    orientation: _react.PropTypes.oneOf(['landscape', 'portrait'])
  }),
  allowUserViewChange: _react.PropTypes.bool,
  onUserViewChange: _react.PropTypes.func
};

exports.default = Timeline;