'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLeaflet = require('react-leaflet');

require('./Map.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// require leaflet code
require('leaflet/dist/leaflet.css');
// "/node_modules/leaflet/dist/images/marker-icon.png",
// "/node_modules/leaflet/dist/images/marker-icon-2x.png",
// "/node_modules/leaflet/dist/images/marker-shadow.png"


var Map = function Map(_ref) {
  var _ref$data = _ref.data,
      data = _ref$data === undefined ? [] : _ref$data,
      _ref$viewParameters = _ref.viewParameters,
      viewParameters = _ref$viewParameters === undefined ? {
    cameraX: 48.8674345,
    cameraY: 2.3455482,
    cameraZoom: 13
  } : _ref$viewParameters,
      updateView = _ref.updateView;


  if (Object.keys(viewParameters).length === 0) {
    viewParameters = {
      cameraX: 48.8674345,
      cameraY: 2.3455482,
      cameraZoom: 13
    };
  }

  var position = [viewParameters.cameraX, viewParameters.cameraY];
  var zoom = viewParameters.cameraZoom;

  var onMoveEnd = function onMoveEnd() {
    var evt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (evt.target) {
      var coords = evt.target.getCenter();
      var view = {
        cameraZoom: evt.target.getZoom(),
        cameraX: coords.lat,
        cameraY: coords.lng
      };
      updateView(view);
    }
  };
  // http://{s}.tile.osm.org/{z}/{x}/{y}.png
  return _react2.default.createElement(
    _reactLeaflet.Map,
    {
      center: position,
      zoom: zoom,
      onMoveEnd: onMoveEnd,
      animate: true },
    _react2.default.createElement(_reactLeaflet.TileLayer, {
      url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png' }),
    data.map(function (point, index) {
      if (point.latitude && point.longitude) {
        var thatPosition = [point.latitude, point.longitude];
        return _react2.default.createElement(
          _reactLeaflet.Marker,
          { key: index, position: thatPosition },
          _react2.default.createElement(
            _reactLeaflet.Popup,
            null,
            _react2.default.createElement(
              'span',
              null,
              point.title
            )
          )
        );
      } else {
        return '';
      }
    })
  );
};

exports.default = Map;