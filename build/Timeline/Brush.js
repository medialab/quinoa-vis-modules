'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeObject = function (_Component) {
  _inherits(TimeObject, _Component);

  function TimeObject(props) {
    _classCallCheck(this, TimeObject);

    var _this = _possibleConstructorReturn(this, (TimeObject.__proto__ || Object.getPrototypeOf(TimeObject)).call(this, props));

    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);
    _this.onMouseMove = _this.onMouseMove.bind(_this);
    _this.onMouseWheel = _this.onMouseWheel.bind(_this);
    _this.updateBrush = _this.updateBrush.bind(_this);
    var from = props.from,
        to = props.to,
        timeBoundaries = props.timeBoundaries;

    var bigAmbitus = timeBoundaries[1] - timeBoundaries[0];
    var beginPortion = (from - timeBoundaries[0]) / bigAmbitus;
    var endPortion = (to - timeBoundaries[0]) / bigAmbitus;
    _this.state = {
      state: undefined,
      beginPortion: beginPortion,
      endPortion: endPortion
    };
    return _this;
  }

  _createClass(TimeObject, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(next) {
      if (next.from !== this.state.from || next.to !== this.state.to && this.state.state === undefined) {
        var from = next.from,
            timeBoundaries = next.timeBoundaries,
            to = next.to;

        var bigAmbitus = timeBoundaries[1] - timeBoundaries[0];
        var beginPortion = (from - timeBoundaries[0]) / bigAmbitus;
        var endPortion = (to - timeBoundaries[0]) / bigAmbitus;
        this.setState({
          beginPortion: beginPortion,
          endPortion: endPortion,
          from: from,
          to: to
        });
      }
    }
  }, {
    key: 'updateBrush',
    value: function updateBrush(_ref, state, portion) {
      var beginPortion = _ref.beginPortion,
          endPortion = _ref.endPortion;

      var beginPortionInState = beginPortion ? beginPortion : this.state.beginPortion;
      var endPortionInState = endPortion ? endPortion : this.state.endPortion;
      if (beginPortionInState > endPortionInState) {
        var temp = beginPortionInState;
        beginPortionInState = endPortionInState;
        endPortionInState = temp;
      }
      var ambitus = this.props.timeBoundaries[1] - this.props.timeBoundaries[0];
      var fromDate = this.props.timeBoundaries[0] + beginPortionInState * ambitus;
      var toDate = this.props.timeBoundaries[0] + endPortionInState * ambitus;

      if (fromDate && toDate && fromDate >= this.props.timeBoundaries[0] && toDate <= this.props.timeBoundaries[1]) {
        this.props.onUpdate(fromDate, toDate, false, true);
        this.setState({
          beginPortion: beginPortionInState,
          endPortion: endPortionInState,
          from: fromDate,
          to: toDate,
          state: state,
          previousPortion: portion
        });
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(evt) {
      if (this.props.active === false) {
        return;
      }
      var bbox = evt.target.getBBox();
      var height = bbox.height;
      var y = evt.clientY;
      var portion = y / height;
      var onElement = portion >= this.state.beginPortion && portion <= this.state.endPortion;
      var state = void 0;
      if (onElement) {
        var positionOnElement = (portion - this.state.beginPortion) / (this.state.endPortion - this.state.beginPortion);
        if (positionOnElement <= 0.2) {
          state = 'resizing-top';
          this.updateBrush({ beginPortion: portion }, state, portion);
        } else if (positionOnElement >= 0.8) {
          state = 'resizing-bottom';
          this.updateBrush({ endPortion: portion }, state, portion);
        } else {
          state = 'moving';
          this.updateBrush({}, state, portion);
        }
      } else {
        state = 'drawing';
        this.updateBrush({ beginPortion: portion, endPortion: portion }, state, portion);
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(evt) {
      if (this.props.active === false) {
        return;
      }
      var bbox = evt.target.getBBox();
      var height = bbox.height;
      var y = evt.clientY;
      var portion = y / height;
      if (this.state.state === 'drawing') {
        this.updateBrush({ endPortion: portion }, this.state.state, portion);
      } else if (this.state.state === 'resizing-top') {
        this.updateBrush({ beginPortion: portion }, this.state.state, portion);
      } else if (this.state.state === 'resizing-bottom') {
        this.updateBrush({ endPortion: portion }, this.state.state, portion);
      } else if (this.state.state === 'moving') {
        if (this.state.previousPortion) {
          var diff = this.state.previousPortion - portion;
          var newBegin = this.state.beginPortion - diff;
          var newEnd = this.state.endPortion - diff;
          if (newBegin >= this.props.timeBoundaries[0] && newEnd <= this.props.timeBoundaries[1]) {
            this.updateBrush({ beginPortion: newBegin, endPortion: newEnd }, this.state.state, portion);
          }
        }
      } else {
        var onElement = portion >= this.state.beginPortion && portion <= this.state.endPortion;
        var state = void 0;
        if (onElement) {
          var positionOnElement = (portion - this.state.beginPortion) / (this.state.endPortion - this.state.beginPortion);
          if (positionOnElement <= 0.33333) {
            state = 'n-resize';
          } else if (positionOnElement >= 0.66666666) {
            state = 's-resize';
          } else {
            state = 'move';
          }
        } else {
          state = 'pointer';
        }
        this.setState({
          cursor: state
        });
      }
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp() {
      if (this.props.active === false) {
        return;
      }
      this.setState({
        state: undefined,
        previousPortion: undefined
      });
    }
  }, {
    key: 'onMouseWheel',
    value: function onMouseWheel(evt) {
      if (this.props.active === false) {
        return;
      }
      var direction = evt.deltaY > 0 ? 1 : -1;
      var displacement = direction * (this.state.endPortion - this.state.beginPortion) / 10;
      var newBegin = this.state.beginPortion + displacement;
      var newEnd = this.state.endPortion + displacement;
      this.updateBrush({ beginPortion: newBegin, endPortion: newEnd }, undefined);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          width = _props.width,
          height = _props.height;
      var onMouseDown = this.onMouseDown,
          onMouseUp = this.onMouseUp,
          onMouseMove = this.onMouseMove,
          onMouseWheel = this.onMouseWheel;
      var _state = this.state,
          from = _state.beginPortion,
          to = _state.endPortion,
          cursor = _state.cursor;

      var bindRef = function bindRef(g) {
        _this2.node = g;
      };

      var scaleY = (0, _d3Scale.scaleLinear)().domain([0, 1]).range([0, height]);
      var fromY = scaleY(from);
      var toY = scaleY(to);

      var brushHeight = toY && fromY && toY - fromY;
      var rectStyle = {
        transform: 'translateX(' + 0 + 'px) ' + 'translateY(' + fromY + 'px)'
      };
      return _react2.default.createElement(
        'g',
        { className: 'brush-container' },
        _react2.default.createElement('rect', {
          x: 0, y: 0,
          width: width,
          height: height,
          className: 'brush-captor',
          onMouseDown: onMouseDown,
          onMouseUp: onMouseUp,
          onMouseMove: onMouseMove,
          onWheel: onMouseWheel,
          ref: bindRef,
          style: { cursor: cursor } }),
        _react2.default.createElement(
          'g',
          {
            className: 'brush-rect',
            style: rectStyle },
          _react2.default.createElement('rect', {
            x: 0,
            y: 0,
            width: width,
            height: brushHeight })
        )
      );
    }
  }]);

  return TimeObject;
}(_react.Component);

exports.default = TimeObject;