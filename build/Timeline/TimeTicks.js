'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _utils = require('./utils');

var _TimeTick = require('./TimeTick');

var _TimeTick2 = _interopRequireDefault(_TimeTick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeTicks = function (_Component) {
  _inherits(TimeTicks, _Component);

  function TimeTicks(props) {
    _classCallCheck(this, TimeTicks);

    var _this = _possibleConstructorReturn(this, (TimeTicks.__proto__ || Object.getPrototypeOf(TimeTicks)).call(this, props));

    _this.state = {
      scaleY: undefined
    };
    return _this;
  }

  _createClass(TimeTicks, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          minimumDate = _props.minimumDate,
          maximumDate = _props.maximumDate,
          transitionsDuration = _props.transitionsDuration;

      var ticks = (0, _utils.computeTicks)(minimumDate, maximumDate);
      var scaleY = (0, _d3Scale.scaleLinear)().domain([minimumDate, maximumDate]).range([0, height]);
      var textHeight = 0.1 * height / ticks.length;
      return width && height ? _react2.default.createElement(
        'g',
        { className: 'ticks-container' },
        ticks.map(function (tick, index) {
          var y = scaleY(tick.time);
          return _react2.default.createElement(_TimeTick2.default, {
            key: index,
            tick: tick,
            y: y,
            textHeight: textHeight,
            width: width,
            transitionsDuration: transitionsDuration });
        })
      ) : null;
    }
  }]);

  return TimeTicks;
}(_react.Component);

exports.default = TimeTicks;