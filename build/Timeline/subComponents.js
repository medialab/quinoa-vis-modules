'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClustersGroup = exports.Controls = exports.TimeTicks = exports.TimeObject = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimeObject = exports.TimeObject = function TimeObject(_ref) {
  var point = _ref.point,
      scale = _ref.scale,
      _ref$color = _ref.color,
      color = _ref$color === undefined ? 'grey' : _ref$color,
      _ref$showLabel = _ref.showLabel,
      showLabel = _ref$showLabel === undefined ? true : _ref$showLabel,
      _ref$showTooltip = _ref.showTooltip,
      showTooltip = _ref$showTooltip === undefined ? true : _ref$showTooltip;
  return _react2.default.createElement(
    'span',
    {
      className: 'time-object' + (point.endDate ? ' period' : ' point'),
      style: {
        top: scale(point.startDate.getTime()) + '%',
        height: point.endDate ? scale(point.endDate.getTime()) - scale(point.startDate.getTime()) + '%' : undefined
      } },
    _react2.default.createElement('span', { className: 'marker', style: {
        background: color
      } }),
    showLabel ? _react2.default.createElement(
      'span',
      { className: 'name-container' },
      _react2.default.createElement(
        'span',
        { className: 'name' },
        point.name.length > 27 ? point.name.substr(0, 30) + '...' : point.name,
        _react2.default.createElement('span', {
          className: 'name-underline',
          style: {
            borderColor: color
          } })
      )
    ) : '',
    showTooltip ? _react2.default.createElement(
      'span',
      {
        className: 'tooltip',
        style: {
          borderColor: color
        } },
      point.name
    ) : ''
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
        _react2.default.createElement(
          'span',
          { className: 'legend' },
          tick.legend
        )
      );
    })
  );
};

var Controls = exports.Controls = function Controls(_ref3) {
  var zoomIn = _ref3.zoomIn,
      zoomOut = _ref3.zoomOut;
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
      { onMouseDown: zoomIn, id: 'zoom-in' },
      'zoom-in'
    ),
    _react2.default.createElement(
      'button',
      { onMouseDown: zoomOut, id: 'zoom-out' },
      'zoom-out'
    )
  );
};

var ClustersGroup = exports.ClustersGroup = function ClustersGroup(_ref4) {
  var clusters = _ref4.clusters,
      viewParameters = _ref4.viewParameters,
      scale = _ref4.scale;
  return _react2.default.createElement(
    'div',
    { className: 'columns-container' },
    clusters.columns.map(function (column) {
      return _react2.default.createElement(
        'div',
        { key: column, className: 'objects-column' },
        clusters.timeObjects.filter(function (obj) {
          return obj.column === column;
        }).map(function (obj, index) {
          return _react2.default.createElement(TimeObject, {
            key: index,
            point: obj,
            scale: scale,
            color: viewParameters.colorsMap[obj.category],
            showLabel: !obj.overlapped });
        })
      );
    })
  );
};