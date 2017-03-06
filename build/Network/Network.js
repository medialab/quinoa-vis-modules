'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _reactSigma = require('react-sigma');

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

require('./Network.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 

require('gexf');

var Network = function (_Component) {
  _inherits(Network, _Component);

  function Network(props, context) {
    _classCallCheck(this, Network);

    var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this, props, context));

    _this.onUserViewChange = (0, _lodash.debounce)(_this.onUserViewChange, 100);
    var state = {
      data: props.data
    };

    _this.state = state;

    _this.buildVisData = _this.buildVisData.bind(_this);
    return _this;
  }

  _createClass(Network, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var onCoordinatesUpdate = function onCoordinatesUpdate(event) {
        var nextCamera = event.target;
        var coords = {
          cameraX: nextCamera.x,
          cameraY: nextCamera.y,
          cameraRatio: nextCamera.ratio,
          cameraAngle: nextCamera.angle
        };
        _this2.onUserViewChange(coords);
      };
      var visData = this.buildVisData(this.props.data, this.props.viewParameters);
      setTimeout(function () {
        if (_this2.sigma) {
          _this2.sigma.sigma.graph.clear();
        }
        _this2.setState({
          visData: visData,
          data: _this2.props.data
        });

        var coords = {
          x: _this2.props.viewParameters.cameraX,
          y: _this2.props.viewParameters.cameraY,
          angle: _this2.props.viewParameters.cameraAngle,
          ratio: _this2.props.viewParameters.cameraRatio
        };
        if (_this2.sigma) {
          var camera = _this2.sigma.sigma.cameras[0];
          camera.isAnimated = true;
          camera.goTo(coords);
          camera.bind('coordinatesUpdated', onCoordinatesUpdate);
        }
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextState) {

      if (this.props.data !== nextState.data) {
        var visData = this.buildVisData(nextProps.data, this.props.viewParameters);
        if (this.sigma) {
          this.sigma.sigma.graph.clear();
        }
        this.setState({
          visData: visData,
          data: nextProps.data
        });
      }

      if (this.props.viewParameters !== nextProps.viewParameters) {
        var coords = {
          x: nextProps.viewParameters.cameraX,
          y: nextProps.viewParameters.cameraY,
          angle: nextProps.viewParameters.cameraAngle,
          ratio: nextProps.viewParameters.cameraRatio
        };
        if (this.sigma) {
          var camera = this.sigma.sigma.cameras[0];
          sigma.misc.animation.camera(camera, coords, {
            duration: 500
          });
        }
      }
    }
  }, {
    key: 'buildVisData',
    value: function buildVisData(data, props) {
      var shownCats = this.props.viewParameters && this.props.viewParameters.shownCategories;
      return {
        nodes: data.nodes.map(function (node) {
          var color = props.colorsMap.nodes && (props.colorsMap.nodes[node.category] || props.colorsMap.nodes.default) || props.colorsMap.default;
          return _extends({}, node, {
            color: !shownCats || !shownCats.nodes || shownCats.nodes.indexOf(node.category) > -1 ? color : (0, _chromaJs2.default)(color).desaturate(3).brighten() .hex()
          });
        }),
        edges: data.edges.map(function (edge) {
          var color = props.colorsMap.edges && (props.colorsMap.edges[edge.category] || props.colorsMap.edges.default) || props.colorsMap.default;
          return _extends({}, edge, {
            type: edge.type || 'undirected',
            color: !shownCats || !shownCats.edges || shownCats.edges.indexOf(edge.category) > -1 ? color : (0, _chromaJs2.default)(color).desaturate(3).brighten().alpha(0.2).hex()
          });
        })
      };
    }


  }, {
    key: 'onUserViewChange',
    value: function onUserViewChange(parameters) {
      var lastEventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'mouse';

      this.setState({
        lastEventType: lastEventType,
        lastEventDate: new Date()
      });
    }

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          _props$allowUserViewC = _props.allowUserViewChange,
          allowUserViewChange = _props$allowUserViewC === undefined ? true : _props$allowUserViewC,
          viewParameters = _props.viewParameters;
      var _state = this.state,
          data = _state.data,
          visData = _state.visData;


      var bindSigInst = function bindSigInst(comp) {
        _this3.sigma = comp;
      };

      var settings = _extends({
        drawEdges: true
      }, viewParameters, {
        mouseEnabled: allowUserViewChange
      });

      if (visData) {
        if (data.spatialized) {
          return _react2.default.createElement(
            'figure',
            { className: 'quinoa-network' + (allowUserViewChange ? '' : ' locked') },
            _react2.default.createElement(_reactSigma.Sigma, {
              style: { width: '100%', height: '100%' },
              graph: visData,
              ref: bindSigInst,
              settings: settings })
          );
        } else {
          return _react2.default.createElement(
            'figure',
            { className: 'quinoa-network' + (allowUserViewChange ? '' : ' locked') },
            _react2.default.createElement(
              _reactSigma.Sigma,
              {
                style: { width: '100%', height: '100%' },
                graph: visData,
                ref: bindSigInst,
                settings: settings },
              _react2.default.createElement(_reactSigma.RandomizeNodePositions, null),
              _react2.default.createElement(_reactSigma.ForceAtlas2, {
                worker: true,
                barnesHutOptimize: true,
                barnesHutTheta: 0.6,
                startingIterations: 100,
                iterationsPerRender: 100,
                linLogMode: true })
            )
          );
        }
      }
      return null;
    }
  }]);

  return Network;
}(_react.Component);

Network.propTypes = {
  data: _react.PropTypes.shape({
    nodes: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      label: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
      category: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
      description: _react.PropTypes.string,
      size: _react.PropTypes.number,
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      id: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number])
    })),
    edges: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      label: _react.PropTypes.string,
      type: _react.PropTypes.string,
      category: _react.PropTypes.string,
      description: _react.PropTypes.string,
      weight: _react.PropTypes.number,
      id: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
      source: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
      target: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
      spatialized: _react.PropTypes.bool
    }))
  }),
  viewParameters: _react.PropTypes.shape({
    cameraX: _react.PropTypes.number,
    cameraY: _react.PropTypes.number,
    cameraRatio: _react.PropTypes.number,
    cameraAngle: _react.PropTypes.number,
    labelThreshold: _react.PropTypes.number,
    minNodeSize: _react.PropTypes.number,
    sideMargin: _react.PropTypes.number
  }),
  allowUserViewChange: _react.PropTypes.bool,
  onUserViewChange: _react.PropTypes.func
};

exports.default = Network;