'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

require('./SVGViewer.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 


var SVGViewer = function (_React$Component) {
  _inherits(SVGViewer, _React$Component);

  function SVGViewer(props) {
    _classCallCheck(this, SVGViewer);

    var _this = _possibleConstructorReturn(this, (SVGViewer.__proto__ || Object.getPrototypeOf(SVGViewer)).call(this, props));

    _this.state = {
      svg: null,
      viewParameters: {
        zoomLevel: 0,
        x: 0,
        y: 0,
        maxZoomLevel: 1000,
        minZoomLevel: -2000,
        zoomFactor: 50,
        perspectiveLevel: 1000
      },
      dragOffset: null,
      isDragEnabled: false
    };
    return _this;
  }

  _createClass(SVGViewer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.parseSVG = this.parseSVG.bind(this);
      this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
      this.startDrag = this.startDrag.bind(this);
      this.stopDrag = this.stopDrag.bind(this);
      this.doDrag = this.doDrag.bind(this);
      this.onUserViewChange = (0, _lodash.debounce)(this.onUserViewChange, 100);

      this.zoom = (0, _lodash.debounce)(this.zoom.bind(this), 10, { leading: true, trailing: false });
      this.setState({
        viewParameters: this.props.viewParameters ? _extends({}, this.props.viewParameters) : this.state.viewParameters
      });
    }


  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      return this.mountSVG(this.parseSVG(this.props.data));
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.viewParameters !== this.state.viewParameters) {
        this.setState({
          viewParameters: _extends({}, this.state.viewParameters, nextProps.viewParameters)
        });
      }
      if (nextProps.data !== this.props.data) {
        this.mountSVG(this.mountSVG(this.parseSVG(this.props.data)));
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.stateViewParameters !== nextState.viewParameters;
    }


  }, {
    key: 'onUserViewChange',
    value: function onUserViewChange(e) {
      if (typeof this.props.onUserViewChange === 'function') {
        this.props.onUserViewChange(e);
      }
    }


  }, {
    key: 'parseSVG',
    value: function parseSVG() {
      var xmlString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return new DOMParser().parseFromString(xmlString, 'text/xml');
    }


  }, {
    key: 'mountSVG',
    value: function mountSVG(svgDom) {
      this.setState({ svg: svgDom });
    }
  }, {
    key: 'mouseWheelHandler',
    value: function mouseWheelHandler(e) {
      e.preventDefault();
      var amount = e.deltaY;
      this.zoom(amount);
    }
  }, {
    key: 'zoom',
    value: function zoom(amount) {
      if (amount !== 0 && amount !== -0) {
        var zoomLevel = this.limitZoomLevel(this.state.viewParameters.zoomLevel + amount);
        this.setState({
          viewParameters: _extends({}, this.state.viewParameters, {
            zoomLevel: zoomLevel
          })
        });
        this.onUserViewChange({
          viewParameters: _extends({}, this.state.viewParameters, {
            zoomLevel: zoomLevel
          }),
          lastEeventType: 'userevent'
        });
      }
    }
  }, {
    key: 'limitZoomLevel',
    value: function limitZoomLevel(level) {
      if (level >= 0) {
        return level < this.props.viewParameters.maxZoomLevel ? level : this.props.viewParameters.maxZoomLevel;
      }

      if (level <= -0) {
        return level > this.props.viewParameters.minZoomLevel ? level : this.props.viewParameters.minZoomLevel;
      }

      return level;
    }
  }, {
    key: 'startDrag',
    value: function startDrag(e) {
      this.setState({
        isDragEnabled: true,
        perspectiveLevel: 0,
        dragOffset: {
          x: e.clientX, 
          y: e.clientY 
        }
      });
      e.currentTarget.addEventListener('mousemove', this.doDrag);
    }
  }, {
    key: 'stopDrag',
    value: function stopDrag(e) {
      this.setState({ isDragEnabled: false });
      e.currentTarget.removeEventListener('mousemove', this.doDrag);
    }
  }, {
    key: 'doDrag',
    value: function doDrag(e) {
      if (!this.state.isDragEnabled) return;
      var xDiff = e.clientX - this.state.dragOffset.x;
      var yDiff = e.clientY - this.state.dragOffset.y;
      var x = this.state.viewParameters.x + xDiff;
      var y = this.state.viewParameters.y + yDiff;
      this.setState({
        viewParameters: _extends({}, this.state.viewParameters, {
          x: x,
          y: y
        }),
        dragOffset: {
          x: e.clientX,
          y: e.clientY
        }
      });
      this.onUserViewChange({
        viewParameters: _extends({}, this.state.viewParameters, {
          x: x,
          y: y
        }),
        lastEeventType: 'userevent'
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var svgContainerStyles = {
        transition: 'all .2s ease',
        transform: 'translateX(' + this.state.viewParameters.x + 'px)\n                  translateY(' + this.state.viewParameters.y + 'px)'
      };

      var svgStyles = {
        transition: 'all .2s ease',
        transform: 'perspective(' + this.props.viewParameters.perspectiveLevel + 'px)\n                  translateZ(' + this.limitZoomLevel(this.state.viewParameters.zoomLevel * this.props.viewParameters.zoomFactor) + 'px)'
      };

      return _react2.default.createElement(
        'div',
        { className: 'svg-container',
          style: svgContainerStyles,
          onMouseDown: this.props.allowUserViewChange ? this.startDrag : void 0,
          onMouseUp: this.props.allowUserViewChange ? this.stopDrag : void 0,
          onMouseLeave: this.props.allowUserViewChange ? this.stopDrag : void 0 },
        this.state.svg ? _react2.default.createElement('div', { className: this.props.allowUserViewChange ? 'grabbable' : '',
          onWheel: this.props.allowUserViewChange ? this.mouseWheelHandler : void 0,
          style: svgStyles,
          dangerouslySetInnerHTML: {
            __html: new XMLSerializer().serializeToString(this.state.svg.documentElement) } }) : _react2.default.createElement(
          'div',
          null,
          'Loading...'
        )
      );
    }
  }]);

  return SVGViewer;
}(_react2.default.Component);



SVGViewer.propTypes = {
  data: _react.PropTypes.string,

  viewParameters: _react.PropTypes.shape({
    maxZoomLevel: _react.PropTypes.number,
    minZoomLevel: _react.PropTypes.number,
    perspectiveLevel: _react.PropTypes.number,
    zoomFactor: _react.PropTypes.number
  }),
  allowUserViewChange: _react.PropTypes.bool,
  onUserViewChange: _react.PropTypes.func
};

SVGViewer.defaultProps = {
  allowUserViewChange: true,
  viewParameters: {
    maxZoomLevel: 1000,
    minZoomLevel: -2000,
    zoomFactor: 50,
    perspectiveLevel: 1000
  }
};

exports.default = SVGViewer;