'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

require('./Network.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('gexf');

var sigInst = void 0;
var camera = void 0;

var Network = function (_Component) {
  _inherits(Network, _Component);

  function Network(props, context) {
    _classCallCheck(this, Network);

    var _this = _possibleConstructorReturn(this, (Network.__proto__ || Object.getPrototypeOf(Network)).call(this, props, context));

    _this.onUserViewChange = (0, _lodash.debounce)(_this.onUserViewChange, 100);
    var state = {
      data: props.data,
      viewParameters: props.viewParameters
    };

    _this.state = state;

    _this.rebootSigma = _this.rebootSigma.bind(_this);
    return _this;
  }

  _createClass(Network, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.rebootSigma();
      this.renderer = sigInst.addRenderer({
        container: this.container,
        type: 'canvas',
        camera: camera
      });
      sigInst.refresh();


      var onCoordinatesUpdate = function onCoordinatesUpdate() {
        var coords = {
          cameraX: camera.x,
          cameraY: camera.y,
          cameraRatio: camera.ratio,
          cameraAngle: camera.angle
        };
        _this2.setState({
          viewParameters: _extends({}, _this2.state.viewParameters, {
            coords: coords
          })
        });
        _this2.onUserViewChange('userevent');
      };

      camera.bind('coordinatesUpdated', onCoordinatesUpdate);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextState) {
      if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(nextProps.viewParameters)) {
        this.setState({
          viewParameters: nextProps.viewParameters
        });
        var coords = {
          x: nextProps.viewParameters.cameraX,
          y: nextProps.viewParameters.cameraY,
          angle: nextProps.viewParameters.cameraAngle,
          ratio: nextProps.viewParameters.cameraRatio
        };
        camera.goTo(coords);
        sigInst.refresh();
      }
      if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
        this.setState({
          data: nextProps.data
        });
      }

      if (JSON.stringify(this.state.data) !== JSON.stringify(nextState.data)) {
        this.rebootSigma();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prev) {
      if (prev.data !== this.state.data) {
        sigInst.graph.clear();
        this.rebootSigma();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (sigInst) {}

    }


  }, {
    key: 'rebootSigma',
    value: function rebootSigma() {
      var props = this.state.viewParameters;
      var visData = {
        nodes: this.state.data.nodes.map(function (node) {
          return _extends({}, node, {
            color: props.colorsMap[node.category] || props.colorsMap.noCategory
          });
        }),
        edges: this.state.data.edges.map(function (edge) {
          return _extends({}, edge, {
            type: edge.type || 'undirected'
          });
        })
      };

      var SIGMA_SETTINGS = {
        labelThreshold: props.labelThreshold || 7,
        minNodeSize: props.minNodeSize || 2,
        edgeColor: 'default',
        defaultEdgeColor: props.colorsMap && props.colorsMap.noCategory || '#D1D1D1',
        sideMargin: props.sideMargin || 0
      };
      sigInst = new sigma({
        settings: SIGMA_SETTINGS,
        graph: visData
      });
      camera = sigInst.addCamera('main');
      camera.isAnimated = true;

      if (!this.state.data.spatialized) {
        sigInst.refresh();
        sigInst.startForceAtlas2({
          startingIterations: 1000
        });
        setTimeout(function () {
          return sigInst.stopForceAtlas2();
        }, 1000);
      }
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
      var _this3 = this;

      var allowUserViewChange = this.props.allowUserViewChange;


      return _react2.default.createElement(
        'figure',
        { className: 'quinoa-network' + (allowUserViewChange ? '' : ' locked') },
        _react2.default.createElement('div', { id: 'sigma-container', ref: function ref(div) {
            return _this3.container = div;
          } }),
        allowUserViewChange ? '' : _react2.default.createElement('div', { id: 'interaction-cache' })
      );
    }
  }]);

  return Network;
}(_react.Component);

Network.propTypes = {
  data: _react.PropTypes.shape({
    nodes: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      label: _react.PropTypes.string,
      category: _react.PropTypes.string,
      description: _react.PropTypes.string,
      size: _react.PropTypes.number,
      x: _react.PropTypes.number,
      y: _react.PropTypes.number,
      id: _react.PropTypes.string
    })),
    edges: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      label: _react.PropTypes.string,
      type: _react.PropTypes.string,
      category: _react.PropTypes.string,
      description: _react.PropTypes.string,
      weight: _react.PropTypes.number,
      id: _react.PropTypes.string,
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