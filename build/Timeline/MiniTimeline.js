'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TimeObjectsContainer = require('./TimeObjectsContainer');

var _TimeObjectsContainer2 = _interopRequireDefault(_TimeObjectsContainer);

var _Brush = require('./Brush');

var _Brush2 = _interopRequireDefault(_Brush);

var _TimeTicks = require('./TimeTicks');

var _TimeTicks2 = _interopRequireDefault(_TimeTicks);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MiniTimeline = function (_Component) {
  _inherits(MiniTimeline, _Component);

  function MiniTimeline(props) {
    _classCallCheck(this, MiniTimeline);

    var _this = _possibleConstructorReturn(this, (MiniTimeline.__proto__ || Object.getPrototypeOf(MiniTimeline)).call(this, props));

    _this.updateDimensions = _this.updateDimensions.bind(_this);
    _this.state = {
      width: undefined,
      height: undefined,
      data: (0, _utils.clusterTimeObjects)(props.data, [props.timeBoundaries.minimumDateDisplay, props.timeBoundaries.maximumDateDisplay])
    };
    return _this;
  }

  _createClass(MiniTimeline, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var updateDimensions = this.updateDimensions;

      updateDimensions();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.data !== this.state.data) {
        this.setState({
          data: (0, _utils.clusterTimeObjects)(nextProps.data, [nextProps.timeBoundaries.minimumDateDisplay, nextProps.timeBoundaries.maximumDateDisplay])
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.parentDimensions.width !== this.props.parentDimensions.width || prevProps.parentDimensions.height !== this.props.parentDimensions.height) {
        this.updateDimensions();
      }
    }
  }, {
    key: 'updateDimensions',
    value: function updateDimensions() {
      if (this.node) {
        var bRect = this.node.getBoundingClientRect();
        this.setState({
          width: bRect.width,
          height: bRect.height
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          viewParameters = _props.viewParameters,
          periodsClusters = _props.periodsClusters,
          eventsClusters = _props.eventsClusters,
          timeBoundaries = _props.timeBoundaries,
          onTimespanUpdate = _props.onTimespanUpdate,
          allowUserEvents = _props.allowUserEvents;
      var _state = this.state,
          width = _state.width,
          height = _state.height,
          data = _state.data;

      var bindRef = function bindRef(svg) {
        _this2.node = svg;
      };
      return _react2.default.createElement(
        'aside',
        { className: 'mini-timeline' },
        _react2.default.createElement(
          'svg',
          {
            className: 'mini-timeline-container',
            ref: bindRef },
          _react2.default.createElement(_TimeObjectsContainer2.default, {
            viewParameters: viewParameters,
            data: data,
            periodsClusters: periodsClusters,
            eventsClusters: eventsClusters,
            width: width * 0.9,
            transform: 'scale(.9, 1)translate(' + width * 0.1 + ' 0)',
            height: height,
            transitionsDuration: 500,
            timeBoundaries: [timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay] }),
          _react2.default.createElement(_TimeTicks2.default, {
            width: width,
            height: height,
            transitionsDuration: 500,
            minimumDate: timeBoundaries.minimumDateDisplay,
            maximumDate: timeBoundaries.maximumDateDisplay }),
          _react2.default.createElement(_Brush2.default, {
            timeBoundaries: [timeBoundaries.minimumDateDisplay, timeBoundaries.maximumDateDisplay],
            from: viewParameters.fromDate,
            to: viewParameters.toDate,
            width: width,
            height: height,
            onUpdate: onTimespanUpdate,
            active: allowUserEvents })
        )
      );
    }
  }]);

  return MiniTimeline;
}(_react.Component);

exports.default = MiniTimeline;