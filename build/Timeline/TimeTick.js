'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Interpolate = require('d3-interpolate');

var _d3Timer = require('d3-timer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 


var TimeTick = function (_Component) {
  _inherits(TimeTick, _Component);

  function TimeTick(props) {
    _classCallCheck(this, TimeTick);

    var _this = _possibleConstructorReturn(this, (TimeTick.__proto__ || Object.getPrototypeOf(TimeTick)).call(this, props));

    _this.state = {
      y: props.y
    };
    _this.update = _this.update.bind(_this);
    return _this;
  }


  _createClass(TimeTick, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.update(this.state.y, this.props.transitionsDuration);
    }

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(next) {
      if (next.y !== this.state.y) {
        this.update(next.y, this.props.transitionsDuration);
        this.setState({
          y: next.y
        });
      }
    }

  }, {
    key: 'update',
    value: function update(y, transitionsDuration) {
      var _this2 = this;

      var node = this.node;

      var from = this.state.y;
      var to = y;
      var interp = (0, _d3Interpolate.interpolateNumber)(from, to);
      if (from) {
        node.setAttribute('transform', 'translate(0 ' + from + ')');
      }
      var onTick = function onTick(elapsed) {
        var t = elapsed < transitionsDuration ? 1 - Math.log(elapsed / transitionsDuration) : 1;
        var newY = interp(t);
        node.setAttribute('transform', 'translate(0 ' + newY + ')');
        if (t >= 1) {
          _this2.transition.stop();
        }
      };
      if (this.transition) {
        this.transition.restart(onTick, 0, transitionsDuration);
      } else {
        this.transition = (0, _d3Timer.timer)(onTick, transitionsDuration);
      }
    }


  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          textHeight = _props.textHeight,
          width = _props.width,
          tick = _props.tick;

      var bindRef = function bindRef(node) {
        _this3.node = node;
      };
      return _react2.default.createElement(
        'g',
        {
          className: 'tick',
          ref: bindRef },
        _react2.default.createElement('line', {
          x1: 0,
          x2: width,
          y1: 0,
          y2: 0 }),
        _react2.default.createElement(
          'text',
          {
            y: textHeight,
            fontSize: textHeight },
          tick.legend
        )
      );
    }
  }]);

  return TimeTick;
}(_react.Component);

exports.default = TimeTick;