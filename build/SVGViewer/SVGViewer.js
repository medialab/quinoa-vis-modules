'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 


require('es6-promise').polyfill();
require('isomorphic-fetch');

var SVGViewer = function (_React$Component) {
  _inherits(SVGViewer, _React$Component);

  function SVGViewer(props) {
    _classCallCheck(this, SVGViewer);

    var _this = _possibleConstructorReturn(this, (SVGViewer.__proto__ || Object.getPrototypeOf(SVGViewer)).call(this, props));

    _this.state = { svg: null };

    _this.loadFile = _this.loadFile.bind(_this);
    _this.parseSVG = _this.parseSVG.bind(_this);
    return _this;
  }

  _createClass(SVGViewer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      return this.props.file.indexOf('http') === 0 ? this.loadFile() : this.parseSVG(this.props.svgString);
    }
  }, {
    key: 'loadFile',
    value: function loadFile() {
      var _this2 = this;

      fetch(this.props.file).then(function (res) {
        if (res.status >= 400) {
          throw new Error('Bad response from server while loading ' + _this2.props.file);
        }
        return res.text();
      }).then(function (svg) {
        _this2.setState({ svg: _this2.parseSVG(svg) });
      }).catch(function (err) {
        throw new Error('Unknown error occured while loading ' + _this2.props.file + ' -> ' + err.message);
      });
    }
  }, {
    key: 'parseSVG',
    value: function parseSVG() {
      var xmlString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return new DOMParser().parseFromString(xmlString, 'text/xml');
    }
  }, {
    key: 'render',
    value: function render() {
      return this.state.svg ? _react2.default.createElement('div', { dangerouslySetInnerHTML: {
          __html: new XMLSerializer().serializeToString(this.state.svg.documentElement)
        } }) : _react2.default.createElement(
        'div',
        null,
        'Loading...'
      );
    }
  }]);

  return SVGViewer;
}(_react2.default.Component);

SVGViewer.defaultProps = {
  allowUserViewChange: true
};

SVGViewer.proptypes = {
  allowUserViewChange: _react.PropTypes.bool,
  file: _react.PropTypes.string,
  svgString: _react.PropTypes.string
};

exports.default = SVGViewer;