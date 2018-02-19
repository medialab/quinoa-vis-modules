'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLeaflet = require('react-leaflet');

var _leaflet = require('leaflet');

var _lodash = require('lodash');

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

    _this.state = {
      data: props.data,
      viewParameters: props.viewParameters
    };
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
      if (this.props.viewParameters !== nextProps.viewParameters) {
        this.setState({
          viewParameters: nextProps.viewParameters
        });
      }
      if (this.props.data !== nextProps.data) {
        this.setState({
          data: nextProps.data
        });
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
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      if (this.state.lastEventDate !== nextState.lastEventDate && typeof this.props.onUserViewChange === 'function') {
        this.props.onUserViewChange({
          lastEventType: nextState.lastEventType,
          viewParameters: nextState.viewParameters
        });
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
      if (map.tap) {
        map.tap.disable();
      }
    }


  }, {
    key: 'onUserViewChange',
    value: function onUserViewChange(newParameters, lastEventType) {
      this.setState({
        lastEventType: lastEventType,
        lastEventDate: new Date(),
        viewParameters: _extends({}, this.state.viewParameters, newParameters)
      });
    }

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          data = _state.data,
          viewParameters = _state.viewParameters;
      var _props$allowUserViewC = this.props.allowUserViewChange,
          allowUserViewChange = _props$allowUserViewC === undefined ? true : _props$allowUserViewC;


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
      return data ? _react2.default.createElement(
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
          data && data.main && Array.isArray(data.main) ? data.main.map(function (obj, index) {
            var shown = viewParameters.shownCategories ? obj.category && viewParameters.shownCategories.main.find(function (cat) {
              return obj.category + '' === cat + '';
            }) !== undefined : true;
            var color = viewParameters.colorsMap.main && viewParameters.colorsMap.main[obj.category] || viewParameters.colorsMap.main.default || viewParameters.colorsMap.default;
            var coordinates = void 0;
            switch (obj.geometry.type) {
              case 'Point':
                var thatPosition = obj.geometry.coordinates;

                if (!Number.isNaN(thatPosition[0]) && !Number.isNaN(thatPosition[1])) {
                  var thatIcon = (0, _leaflet.divIcon)({
                    className: 'point-marker-icon',
                    html: '<span class="shape" style="background:' + color + '"></span>'
                  });
                  return _react2.default.createElement(
                    _reactLeaflet.Marker,
                    {
                      key: index,
                      position: thatPosition,
                      icon: thatIcon,
                      opacity: shown ? 1 : 0.1 },
                    _react2.default.createElement(
                      _reactLeaflet.Popup,
                      null,
                      _react2.default.createElement(
                        'span',
                        null,
                        obj.title
                      )
                    )
                  );
                }
                break;

              case 'Polygon':
                coordinates = obj.geometry.coordinates.map(function (couple) {
                  return couple.reverse();
                });
                return _react2.default.createElement(_reactLeaflet.Polygon, {
                  key: index,
                  color: 'white',
                  fillColor: color,
                  opacity: shown ? 1 : 0.1,
                  stroke: true,
                  positions: coordinates });
              case 'Polyline':
              case 'LineString':
                coordinates = obj.geometry.coordinates.map(function (couple) {
                  return couple.reverse();
                });
                return _react2.default.createElement(_reactLeaflet.Polyline, {
                  key: index,
                  color: color,
                  opacity: shown ? 1 : 0.1,
                  positions: coordinates });

              default:
                return '';

            }
          }) : null
        )
      ) :
      'Loading';
    }
  }]);

  return Map;
}(_react.Component);

Map.propTypes = {
  data: _propTypes2.default.shape({
    main: _propTypes2.default.arrayOf(_propTypes2.default.shape({
      title: _propTypes2.default.string,
      category: _propTypes2.default.string,
      geometry: _propTypes2.default.shape({
        type: _propTypes2.default.string
      })
    }))
  }),
  viewParameters: _propTypes2.default.shape({
    colorsMap: _propTypes2.default.object,
    shownCategories: _propTypes2.default.object,
    cameraX: _propTypes2.default.number,
    cameraY: _propTypes2.default.number,
    cameraZoom: _propTypes2.default.number,
    tilesUrl: _propTypes2.default.string 
  }),
  allowUserViewChange: _propTypes2.default.bool,
  onUserViewChange: _propTypes2.default.func
};

exports.default = Map;