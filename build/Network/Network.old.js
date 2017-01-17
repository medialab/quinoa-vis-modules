'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./Graph.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('gexf');

var SIGMA_SETTINGS = {
  labelThreshold: 7,
  minNodeSize: 2,
  edgeColor: 'default',
  defaultEdgeColor: '#D1D1D1',
  sideMargin: 0
};

var sigInst = new sigma({
  settings: SIGMA_SETTINGS
});

var camera = sigInst.addCamera('main');
camera.isAnimated = true;

var Graph = function (_Component) {
  _inherits(Graph, _Component);

  function Graph(props, context) {
    _classCallCheck(this, Graph);

    return _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, props, context));
  }

  _createClass(Graph, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var data = new DOMParser().parseFromString(this.props.data[0].gexf, 'application/xml');
      this.renderer = sigInst.addRenderer({
        container: this.container,
        camera: 'main'
      });

      sigma.parsers.gexf(data, sigInst, function () {
        return sigInst.refresh();
      });


      var onCoordinatesUpdate = function onCoordinatesUpdate() {
        var coords = {
          cameraX: camera.x,
          cameraY: camera.y,
          cameraRatio: camera.ratio,
          cameraAngle: camera.angle
        };
        _this2.props.updateView(coords);
      };

      camera.bind('coordinatesUpdated', onCoordinatesUpdate);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(next) {
      if (JSON.stringify(this.props.viewParameters) !== JSON.stringify(next.viewParameters)) {
        var coords = {
          x: next.viewParameters.cameraX,
          y: next.viewParameters.cameraY,
          angle: next.viewParameters.cameraAngle,
          ratio: next.viewParameters.cameraRatio
        };
        camera.goTo(coords);
        sigInst.refresh();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prev) {
      if (prev.data !== this.props.data) {
        var data = new DOMParser().parseFromString(this.props.data[0].gexf, 'application/xml');
        sigInst.graph.clear();
        sigma.parsers.gexf(data, sigInst, function () {
          camera.goTo();
          sigInst.refresh();
          sigInst.loadCamera('main');
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      sigInst.killRenderer(this.renderer);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('div', { id: 'sigma-container', ref: function ref(div) {
          return _this3.container = div;
        } });
    }
  }]);

  return Graph;
}(_react.Component);

exports.default = Graph;