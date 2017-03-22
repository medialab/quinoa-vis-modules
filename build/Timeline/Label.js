'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


var Label = function (_Component) {
  _inherits(Label, _Component);

  function Label(props) {
    _classCallCheck(this, Label);

    var _this = _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this, props));

    _this.state = {
      hovered: false
    };
    _this.toggleHover = _this.toggleHover.bind(_this);
    return _this;
  }

  _createClass(Label, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: 'toggleHover',
    value: function toggleHover(target) {
      var hovered = target === undefined ? !this.state.hovered : target;
      this.setState({
        hovered: hovered
      });
      this.props.toggleLabelHover(this.props.timeObject.id, hovered);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          timeObject = _props.timeObject,
          scaleX = _props.scaleX,
          scaleY = _props.scaleY,
          columnWidth = _props.columnWidth,
          screenHeight = _props.screenHeight,
          screenWidth = _props.screenWidth,
          color = _props.color;
      var availableColumns = timeObject.availableColumns;
      var hovered = this.state.hovered;

      var x = scaleX(timeObject.column);
      var y = scaleY(timeObject.startDate.getTime());
      var objectWidth = columnWidth > 10 ? 10 : columnWidth;
      var textHeight = screenHeight / 40;
      var labelWidth = columnWidth * availableColumns - columnWidth * 0.3;
      labelWidth = labelWidth < 0 ? 0 : labelWidth;

      var bindTextRef = function bindTextRef(text) {
        _this2.text = text;
      };
      var availableWidth = screenWidth - x + objectWidth;
      var bgWidth = this.text ? this.text.getBBox().width : 0;
      if (bgWidth > availableWidth) {
        bgWidth = availableWidth;
      }

      var labelY = timeObject.type === 'event' ? y : y + textHeight / 2;
      labelY = labelY > 0 ? labelY : textHeight;

      var onMouseEnter = function onMouseEnter() {
        return _this2.toggleHover(true);
      };
      var onMouseLeave = function onMouseLeave() {
        return _this2.toggleHover(false);
      };
      return _react2.default.createElement(
        'g',
        {
          className: 'label-group ' + (availableColumns === 0 ? 'hidden' : ''),
          transform: 'translate(' + x + ' ' + labelY + ')',
          id: 'time-object-' + timeObject.id,
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave },
        _react2.default.createElement('rect', {
          fill: '#FFFFFF',
          x: timeObject.type === 'event' ? -objectWidth / 2 : objectWidth,
          y: -textHeight,
          width: hovered ? bgWidth + objectWidth : labelWidth,
          height: textHeight * 2,
          className: 'background-rect' }),
        timeObject.type === 'event' ? _react2.default.createElement('circle', {
          cx: objectWidth / 2,
          cy: 0,
          r: objectWidth / 2,
          fill: color }) : null,
        _react2.default.createElement(
          'text',
          {
            x: objectWidth * 1.2,
            y: textHeight / 3,
            fontSize: textHeight,
            clipPath: 'url(#clip' + timeObject.id + ')',
            ref: bindTextRef },
          timeObject.title
        ),
        _react2.default.createElement(
          'clipPath',
          { id: 'clip' + timeObject.id },
          _react2.default.createElement('rect', {
            x: -objectWidth / 2,
            y: -textHeight,
            width: hovered ? bgWidth : labelWidth,
            height: textHeight * 2,
            className: 'rect-clip-path' })
        )
      );
    }
  }]);

  return Label;
}(_react.Component);

exports.default = Label;