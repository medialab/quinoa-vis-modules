'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Controls = exports.TimeTicks = exports.TimeObject = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var TimeObject = exports.TimeObject = function TimeObject(_ref) {
  var point = _ref.point,
      scale = _ref.scale;
  return _react2.default.createElement(
    'span',
    {
      className: 'time-object' + (point.endDate ? ' period' : ' point'),
      title: point.name,
      style: {
        top: scale(point.startDate.getTime()) + '%',
        height: point.endDate ? scale(point.endDate.getTime()) - scale(point.startDate.getTime()) + '%' : undefined
      } },
    _react2.default.createElement('span', { className: 'marker' }),
    _react2.default.createElement(
      'span',
      { className: 'name' },
      point.name.substr(0, 30)
    )
  );
};

var TimeTicks = exports.TimeTicks = function TimeTicks(_ref2) {
  var ticks = _ref2.ticks,
      scale = _ref2.scale;
  return _react2.default.createElement(
    'div',
    { className: 'time-graduations-container' },
    ticks.map(function (tick, index) {
      return _react2.default.createElement(
        'p',
        {
          className: 'tick',
          key: index,
          style: {
            top: scale(tick.time) + '%'
          } },
        tick.legend
      );
    })
  );
};

var Controls = exports.Controls = function Controls(_ref3) {
  _objectDestructuringEmpty(_ref3);

  return _react2.default.createElement(
    'div',
    { className: 'controls-container' },
    _react2.default.createElement(
      'button',
      { id: 'left' },
      'backward'
    ),
    _react2.default.createElement(
      'button',
      { id: 'right' },
      'forward'
    ),
    _react2.default.createElement(
      'button',
      { id: 'zoom-in' },
      'zoom-in'
    ),
    _react2.default.createElement(
      'button',
      { id: 'zoom-out' },
      'zoom-out'
    )
  );
};