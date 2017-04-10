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

var _LabelsContainer = require('./LabelsContainer');

var _LabelsContainer2 = _interopRequireDefault(_LabelsContainer);

var _TimeTicks = require('./TimeTicks');

var _TimeTicks2 = _interopRequireDefault(_TimeTicks);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainTimeline = function (_Component) {
  _inherits(MainTimeline, _Component);

  function MainTimeline(props) {
    _classCallCheck(this, MainTimeline);

    var _this = _possibleConstructorReturn(this, (MainTimeline.__proto__ || Object.getPrototypeOf(MainTimeline)).call(this, props));

    _this.updateDimensions = _this.updateDimensions.bind(_this);
    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);
    _this.onMouseMove = _this.onMouseMove.bind(_this);
    _this.onDoubleClick = _this.onDoubleClick.bind(_this);
    _this.onLabelsHovered = _this.onLabelsHovered.bind(_this);

    _this.state = {
      width: undefined,
      height: undefined,
      data: (0, _utils.clusterTimeObjects)(props.data, [props.viewParameters.fromDate, props.viewParameters.toDate]),
      grabbing: false
    };
    return _this;
  }

  _createClass(MainTimeline, [{
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
          data: (0, _utils.clusterTimeObjects)(nextProps.data, [nextProps.viewParameters.fromDate, nextProps.viewParameters.toDate])
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
    key: 'onMouseDown',
    value: function onMouseDown(evt) {
      if (!this.props.allowUserEvents) {
        return;
      }
      var y = evt.clientY;
      this.setState({
        grabbing: true,
        prevY: y
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(evt) {
      if (!this.props.allowUserEvents) {
        return;
      }
      if (this.state.grabbing) {
        var y = evt.clientY;
        var diff = this.state.prevY - y;
        var dateDiff = diff / this.state.height * (this.props.viewParameters.toDate - this.props.viewParameters.fromDate);
        this.props.onPan(dateDiff > 0, Math.abs(dateDiff));
        this.setState({
          prevY: y
        });
      }
    }
  }, {
    key: 'onDoubleClick',
    value: function onDoubleClick(evt) {
      if (!this.props.allowUserEvents) {
        return;
      }

      var y = evt.clientY;
      var h = this.captor.getBBox().height;
      var portion = y / h;
      var _props$viewParameters = this.props.viewParameters,
          fromDate = _props$viewParameters.fromDate,
          toDate = _props$viewParameters.toDate;

      var ambitus = toDate - fromDate;
      var target = fromDate + ambitus * portion;
      var newAmbitus = ambitus / 4;
      var newFrom = target - newAmbitus;
      var newTo = target + newAmbitus;
      this.props.setViewSpan(newFrom, newTo, false);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp() {
      if (!this.props.allowUserEvents) {
        return;
      }
      this.setState({
        grabbing: false,
        prevY: undefined
      });
    }
  }, {
    key: 'onLabelsHovered',
    value: function onLabelsHovered() {
      this.onMouseUp();
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
          allowUserEvents = _props.allowUserEvents,
          onObjectSelection = _props.onObjectSelection,
          onBgClick = _props.onBgClick,
          formatDate = _props.formatDate;
      var onDoubleClick = this.onDoubleClick,
          onMouseDown = this.onMouseDown,
          onMouseMove = this.onMouseMove,
          onMouseUp = this.onMouseUp,
          onLabelsHovered = this.onLabelsHovered;
      var _state = this.state,
          width = _state.width,
          height = _state.height,
          data = _state.data,
          grabbing = _state.grabbing;

      var bindRef = function bindRef(svg) {
        _this2.node = svg;
      };
      var bindCaptorRef = function bindCaptorRef(rect) {
        _this2.captor = rect;
      };

      var onWheel = function onWheel(e) {
        e.stopPropagation();
        e.preventDefault();
        if (!allowUserEvents) {
          return;
        }
        var displacement = e.deltaY / 200;
        if (displacement > 0.9) {
          displacement = 0.9;
        }
        if (displacement < -0.9) {
          displacement = -0.9;
        }
        _this2.props.onZoom(1 + displacement);
      };

      var objectsDisplacement = 'scale(.9, 1)translate(' + width * 0.1 + ' 0)';

      return _react2.default.createElement(
        'section',
        { className: 'main-timeline', onWheel: onWheel },
        _react2.default.createElement(
          'svg',
          {
            className: 'main-timeline-container',
            ref: bindRef },
          _react2.default.createElement(_TimeTicks2.default, {
            width: width,
            height: height,
            transitionsDuration: 500,
            minimumDate: viewParameters.fromDate,
            maximumDate: viewParameters.toDate }),
          _react2.default.createElement('rect', {
            className: 'timeline-captor',
            width: width,
            height: height,
            style: {
              cursor: grabbing ? 'grabbing' : 'grab'
            },
            x: 0,
            y: 0,
            ref: bindCaptorRef,
            onMouseDown: onMouseDown,
            onMouseMove: onMouseMove,
            onMouseUp: onMouseUp,
            onDoubleClick: onDoubleClick,
            onClick: onBgClick }),
          _react2.default.createElement(_TimeObjectsContainer2.default, {
            viewParameters: viewParameters,
            data: data,
            width: width * 0.9,
            height: height,
            onObjectSelection: onObjectSelection,
            transform: objectsDisplacement,
            transitionsDuration: 500,
            timeBoundaries: [viewParameters.fromDate, viewParameters.toDate],
            selectedObjectId: viewParameters.selectedObjectId }),
          _react2.default.createElement(_LabelsContainer2.default, {
            viewParameters: viewParameters,
            data: data,
            width: width * 0.9,
            height: height,
            transform: objectsDisplacement,
            transitionsDuration: 500,
            onObjectSelection: onObjectSelection,
            timeBoundaries: [viewParameters.fromDate, viewParameters.toDate],
            onLabelsHovered: onLabelsHovered,
            selectedObjectId: viewParameters.selectedObjectId })
        ),
        _react2.default.createElement(
          'div',
          { className: 'time-boundaries-container' },
          _react2.default.createElement(
            'div',
            { id: 'from-date' },
            formatDate(viewParameters.fromDate)
          ),
          _react2.default.createElement(
            'div',
            { id: 'to-date' },
            formatDate(viewParameters.toDate)
          )
        )
      );
    }
  }]);

  return MainTimeline;
}(_react.Component);

exports.default = MainTimeline;