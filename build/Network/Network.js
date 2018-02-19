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

var _lodash = require('lodash');

var _Sigma = require('react-sigma/lib/Sigma');

var _Sigma2 = _interopRequireDefault(_Sigma);

var _ForceAtlas = require('react-sigma/lib/ForceAtlas2');

var _ForceAtlas2 = _interopRequireDefault(_ForceAtlas);

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

    _this.onCoordinatesUpdate = (0, _lodash.debounce)(_this.onCoordinatesUpdate.bind(_this), 100);
    _this.getNodesPositions = _this.getNodesPositions.bind(_this);
    var state = {
      data: props.data,
      viewParameters: _extends({}, props.viewParameters)
    };

    _this.state = state;

    _this.buildVisData = _this.buildVisData.bind(_this);
    return _this;
  }



  _createClass(Network, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var visData = this.buildVisData(this.props.data, this.props.viewParameters);
      setTimeout(function () {
        if (_this2.sigma) {
          _this2.sigma.sigma.graph.clear();
        }
        _this2.setState({
          visData: visData,
          data: _this2.props.data
        });

        var coordinates = {
          x: _this2.props.viewParameters.cameraX,
          y: _this2.props.viewParameters.cameraY,
          angle: _this2.props.viewParameters.cameraAngle,
          ratio: _this2.props.viewParameters.cameraRatio
        };
        if (_this2.sigma) {
          var camera = _this2.sigma.sigma.cameras[0];
          camera.isAnimated = true;
          camera.goTo(coordinates);
          camera.bind('coordinatesUpdated', _this2.onCoordinatesUpdate);
        }
      });
    }


  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (
      this.props.data !== nextProps.data || this.props.viewParameters.dataMap !== nextProps.viewParameters.dataMap || this.props.viewParameters.shownCategories !== nextProps.viewParameters.shownCategories || this.props.viewParameters.colorsMap !== nextProps.viewParameters.colorsMap) {
        var visData = this.buildVisData(nextProps.data, nextProps.viewParameters);
        if (this.sigma) {




          this.sigma.sigma.graph.clear();
          this.sigma.sigma.graph.read(visData);
          this.sigma.sigma.refresh();
        }
        this.setState({
          visData: visData,
          data: nextProps.data,
          viewParameters: nextProps.viewParameters
        });
      }
      if (
      JSON.stringify(this.state.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
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
        this.setState({
          viewParameters: nextProps.viewParameters
        });
      }
    }

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevState, prevProps) {
      if (prevState.viewParameters.labelThreshold !== this.state.viewParameters.labelThreshold) {
        if (this.sigma) {
          this.sigma.sigma.renderers[0].settings('labelThreshold', this.state.viewParameters.labelThreshold);
          this.sigma.sigma.refresh();
        }
      }
      if (prevState.viewParameters.minNodeSize !== this.state.viewParameters.minNodeSize) {
        if (this.sigma) {
          this.sigma.sigma.renderers[0].settings('minNodeSize', this.state.viewParameters.minNodeSize);
          this.sigma.sigma.refresh();
        }
      }
      if (prevProps.allowUserViewChange !== this.props.allowUserViewChange && this.sigma) {
        this.sigma.sigma.settings('mouseEnabled', this.props.allowUserViewChange);
      }
    }

  }, {
    key: 'buildVisData',
    value: function buildVisData(data, viewParameters) {
      var shownCats = viewParameters.shownCategories;
      return {
        nodes: data.nodes.map(function (node) {
          var category = node.category === undefined ? 'default' : node.category;
          var color = viewParameters.colorsMap.nodes && (viewParameters.colorsMap.nodes[category] || viewParameters.colorsMap.nodes.default) || viewParameters.colorsMap.default;
          return _extends({}, node, {
            color: !shownCats || !shownCats.nodes || shownCats.nodes.find(function (cat) {
              return cat + '' === category + '';
            }) !== undefined ? color : (0, _chromaJs2.default)(color).desaturate(5).brighten().hex()
          });
        }),
        edges: data.edges.map(function (edge) {
          var category = edge.category === undefined ? 'default' : edge.category;
          var color = viewParameters.colorsMap.edges && (viewParameters.colorsMap.edges[category] || viewParameters.colorsMap.edges.default) || viewParameters.colorsMap.default;
          return _extends({}, edge, {
            type: edge.type || 'undirected',
            color: !shownCats || !shownCats.edges || shownCats.edges.find(function (cat) {
              return cat + '' === category + '';
            }) !== undefined ? color : (0, _chromaJs2.default)(color).desaturate(5).brighten().alpha(0.2).hex()
          });
        })
      };
    }

  }, {
    key: 'getNodesPositions',
    value: function getNodesPositions() {
      var nodes = this.sigma.sigma.graph.nodes();
      return nodes.map(function (node) {
        return {
          x: node.x,
          y: node.y,
          id: node.id
        };
      });
    }

  }, {
    key: 'onCoordinatesUpdate',
    value: function onCoordinatesUpdate(event) {
      var nextCamera = event.target;
      var coordinates = {
        cameraX: nextCamera.x,
        cameraY: nextCamera.y,
        cameraRatio: nextCamera.ratio,
        cameraAngle: nextCamera.angle
      };
      if (typeof this.props.onUserViewChange === 'function') {
        this.props.onUserViewChange({
          viewParameters: _extends({}, this.state.viewParameters, coordinates),
          lastEeventType: 'userevent'
        });
      }
    }

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          _props$allowUserViewC = _props.allowUserViewChange,
          allowUserViewChange = _props$allowUserViewC === undefined ? true : _props$allowUserViewC,
          _props$forceAtlasActi = _props.forceAtlasActive,
          forceAtlasActive = _props$forceAtlasActi === undefined ? false : _props$forceAtlasActi,
          viewParameters = _props.viewParameters;
      var visData = this.state.visData;


      var bindSigInst = function bindSigInst(comp) {
        _this3.sigma = comp;
      };

      var settings = _extends({
        drawEdges: true
      }, viewParameters, {
        mouseEnabled: allowUserViewChange
      });

      if (visData) {
        return forceAtlasActive ?
        _react2.default.createElement(
          'figure',
          { className: 'quinoa-network' + (allowUserViewChange ? '' : ' locked') },
          _react2.default.createElement(
            _Sigma2.default,
            {
              style: { width: '100%', height: '100%' },
              graph: visData,
              ref: bindSigInst,
              settings: settings },
            _react2.default.createElement(_ForceAtlas2.default, {
              worker: true,
              barnesHutOptimize: true,
              barnesHutTheta: 0.6,
              iterationsPerRender: 10,
              linLogMode: true })
          )
        ) :
        _react2.default.createElement(
          'figure',
          { className: 'quinoa-network' + (allowUserViewChange ? '' : ' locked') },
          _react2.default.createElement(_Sigma2.default, {
            style: { width: '100%', height: '100%' },
            graph: visData,
            ref: bindSigInst,
            settings: settings })
        );
      }
      return null;
    }
  }]);

  return Network;
}(_react.Component);



Network.propTypes = {
  data: _propTypes2.default.shape({
    nodes: _propTypes2.default.arrayOf(_propTypes2.default.shape({
      label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
      category: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
      description: _propTypes2.default.string,
      size: _propTypes2.default.number,
      x: _propTypes2.default.number,
      y: _propTypes2.default.number,
      id: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
    })),
    edges: _propTypes2.default.arrayOf(_propTypes2.default.shape({
      label: _propTypes2.default.string,
      type: _propTypes2.default.string,
      category: _propTypes2.default.string,
      description: _propTypes2.default.string,
      weight: _propTypes2.default.number,
      id: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
      source: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
      target: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
    })),
    spatialized: _propTypes2.default.bool
  }),
  forceAtlasActive: _propTypes2.default.bool,
  viewParameters: _propTypes2.default.shape({
    cameraX: _propTypes2.default.number,
    cameraY: _propTypes2.default.number,
    cameraRatio: _propTypes2.default.number,
    cameraAngle: _propTypes2.default.number,
    colorsMap: _propTypes2.default.object,
    shownCategories: _propTypes2.default.object,
    labelThreshold: _propTypes2.default.number,
    minNodeSize: _propTypes2.default.number,
    sideMargin: _propTypes2.default.number
  }),
  allowUserViewChange: _propTypes2.default.bool,
  onUserViewChange: _propTypes2.default.func
};

exports.default = Network;