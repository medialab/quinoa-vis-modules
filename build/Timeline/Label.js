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

    return _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this, props));
  }

  _createClass(Label, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          timeObject = _props.timeObject,
          scaleX = _props.scaleX,
          scaleY = _props.scaleY,
          columnWidth = _props.columnWidth,
          color = _props.color;

      var x = scaleX(timeObject.column);
      var y = scaleY(timeObject.startDate.getTime());
      var objectWidth = columnWidth > 10 ? 10 : columnWidth;
      var height = timeObject.type === 'period' && scaleY(timeObject.endDate.getTime()) - y;
      return _react2.default.createElement(
        'g',
        {
          className: 'label-group',
          transform: 'translate(' + x + ' ' + y + ')',
          id: 'time-object-' + timeObject.id,
          clipPath: 'url(#clip' + timeObject.id + ')' },
        _react2.default.createElement('rect', {
          fill: '#FFFFFF',
          fillOpacity: 0.8,
          x: objectWidth,
          y: -columnWidth / 10,
          width: columnWidth + columnWidth / 10,
          height: objectWidth }),
        timeObject.type === 'event' ? _react2.default.createElement('circle', {
          cx: objectWidth / 2,
          cy: 0,
          r: objectWidth / 2,
          fill: color }) : _react2.default.createElement('rect', {
          x: 0,
          y: 0,
          width: objectWidth,
          height: height,
          fill: color }),
        _react2.default.createElement(
          'text',
          {
            x: objectWidth * 2,
            y: objectWidth / 2,
            maxWidth: columnWidth },
          timeObject.title
        ),
        _react2.default.createElement(
          'clipPath',
          { id: 'clip' + timeObject.id },
          _react2.default.createElement('rect', {
            x: objectWidth,
            y: -columnWidth / 10,
            width: columnWidth,
            height: objectWidth * 5 })
        )
      );
    }
  }]);

  return Label;
}(_react.Component);

exports.default = Label;