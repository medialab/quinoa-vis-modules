'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLeaflet = require('react-leaflet');

var _leaflet = require('leaflet');

var _lodash = require('lodash');

var _utils = require('./utils');

require('./Map.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('leaflet/dist/leaflet.css');

var Map = function (_Component) {
  _inherits(Map, _Component);

  function Map(props) {
    _classCallCheck(this, Map);

    var _this = _possibleConstructorReturn(this, (Map.__proto__ || Object.getPrototypeOf(Map)).call(this, props));

    _this.state = (0, _utils.computeDataRelatedState)(props.data, props.viewParameters.dataMap, props.viewParameters, props.dataStructure);
    _this.onUserViewChange = (0, _lodash.debounce)(_this.onUserViewChange, 100);
    _this.activateMap = _this.activateMap.bind(_this);
    _this.deactivateMap = _this.deactivateMap.bind(_this);
    return _this;
  }

  _createClass(Map, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var map = this.map.leafletElement;
      if (!this.props.allowUserViewChange) {
        this.deactivateMap(map);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
        this.setState({
          viewParameters: nextProps.viewParameters
        });
      }

      if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
        var newStateParts = (0, _utils.computeDataRelatedState)(nextProps.data, nextProps.viewParameters.dataMap, nextProps.viewParameters, nextProps.dataStructure);
        this.setState(_extends({}, newStateParts));
      }

      if (nextProps.allowUserViewChange !== this.props.allowUserViewChange) {
        var map = this.map.leafletElement;
        if (nextProps.allowUserViewChange) {
          this.activateMap(map);
        } else {
          this.deactivateMap(map);
        }
      }
    }


  }, {
    key: 'activateMap',
    value: function activateMap(map) {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      if (map.tap) {
        map.tap.enable();
      }
    }


  }, {
    key: 'deactivateMap',
    value: function deactivateMap(map) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if (map.tap) map.tap.disable();
    }


  }, {
    key: 'onUserViewChange',
    value: function onUserViewChange(lastEventType) {
      if (typeof this.props.onUserViewChange === 'function') {
        this.props.onUserViewChange({
          lastEventType: lastEventType,
          viewParameters: this.state.viewParameters
        });
      }
    }

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          data = _state.data,
          viewParameters = _state.viewParameters;
      var allowUserViewChange = this.props.allowUserViewChange;

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
          _this2.onUserViewChange(view);
        }
      };
      var refMap = function refMap(c) {
        _this2.map = c;
      };
      return _react2.default.createElement(
        'figure',
        { className: 'quinoa-map' + (allowUserViewChange ? '' : ' locked') },
        _react2.default.createElement(
          _reactLeaflet.Map,
          {
            ref: refMap,
            center: position,
            zoom: zoom,
            onMoveEnd: onMoveEnd,
            animate: true },
          _react2.default.createElement(_reactLeaflet.TileLayer, {
            url: viewParameters.tilesUrl }),
          data.map(function (object, index) {
            switch (object.geometry.type) {
              case 'Point':
                var thatPosition = object.geometry.coordinates;
                if (!isNaN(thatPosition[0]) && !isNaN(thatPosition[1])) {
                  var color = viewParameters.colorsMap[object.category] || viewParameters.colorsMap.noCategory;
                  var thatIcon = (0, _leaflet.divIcon)({
                    className: 'point-marker-icon',
                    html: '<span class="shape" style="background:' + color + '"></span>'
                  });
                  return _react2.default.createElement(
                    _reactLeaflet.Marker,
                    {
                      key: index,
                      position: thatPosition,
                      icon: thatIcon },
                    _react2.default.createElement(
                      _reactLeaflet.Popup,
                      null,
                      _react2.default.createElement(
                        'span',
                        null,
                        object.title
                      )
                    )
                  );
                }
                break;
              case 'Polygon':
                var coordinates = object.geometry.coordinates.map(function (couple) {
                  return couple.reverse();
                });
                return _react2.default.createElement(_reactLeaflet.Polygon, {
                  key: index,
                  positions: coordinates });
              default:
                return '';
            }
          })
        )
      );
    }
  }]);

  return Map;
}(_react.Component);

Map.propTypes = {
  dataStructure: _react.PropTypes.oneOf(['flatArray', 'geoJSON']),
  viewParameters: _react.PropTypes.shape({
    dataMap: _react.PropTypes.shape({
      latitude: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      longitude: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      title: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
      category: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func])
    }),
    cameraX: _react.PropTypes.number,
    cameraY: _react.PropTypes.number,
    cameraZoom: _react.PropTypes.number
  }),
  allowUserViewChange: _react.PropTypes.bool,
  onUserViewChange: _react.PropTypes.func
};

exports.default = Map;