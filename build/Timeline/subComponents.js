'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Brush = exports.ClustersGroup = exports.Controls = exports.TimeTicks = exports.TimeObject = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 


var TimeObject = exports.TimeObject = function TimeObject(_ref) {
  var point = _ref.point,
      scale = _ref.scale,
      color = _ref.color,
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
      zoomOut = _ref3.zoomOut,
      panBackward = _ref3.panBackward,
      panForward = _ref3.panForward;
  return _react2.default.createElement(
    'div',
    { className: 'controls-container' },
    _react2.default.createElement(
      'button',
      { onMouseDown: panBackward, id: 'left' },
      'backward'
    ),
    _react2.default.createElement(
      'button',
      { onMouseDown: panForward, id: 'right' },
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
            color: viewParameters.colorsMap[obj.category] || viewParameters.colorsMap.noCategory,
            showLabel: !obj.overlapped });
        })
      );
    })
  );
};

var getEventCoordinates = function getEventCoordinates(e) {
  var w = e.target.clientWidth;
  var h = e.target.clientHeight;
  var x = e.target.offsetLeft;
  var y = e.target.offsetTop;
  var relativeX = e.clientX - x;
  var relativeY = e.clientY - y;
  var portionX = relativeX / w;
  var portionY = relativeY / h;
  return {
    relativeX: relativeX,
    relativeY: relativeY,
    absoluteX: e.clientX,
    absoluteY: e.clientY,
    portionX: portionX,
    portionY: portionY
  };
};


var Brush = exports.Brush = function (_React$Component) {
  _inherits(Brush, _React$Component);

  function Brush(props) {
    _classCallCheck(this, Brush);

    var _this = _possibleConstructorReturn(this, (Brush.__proto__ || Object.getPrototypeOf(Brush)).call(this, props));

    _this.state = {
      canBrushContainer: false,
      brushingContainer: false,
      containerBrushStartPosition: undefined,
      brushInteractionMode: undefined,
      brushMoveStartPosition: undefined
    };
    return _this;
  }

  _createClass(Brush, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          scale = _props.scale,
          fromDate = _props.fromDate,
          toDate = _props.toDate,
          onSimpleClick = _props.onSimpleClick,
          onSpanEventDefinition = _props.onSpanEventDefinition,
          allowBrush = _props.allowBrush;


      var onContainerLeave = function onContainerLeave() {
        _this2.setState({
          canBrushContainer: false,
          brushingContainer: false,
          containerBrushStartPosition: undefined,
          brushInteractionMode: undefined,
          brushMoveStartPosition: undefined
        });
      };

      var onBrushMouseMove = function onBrushMouseMove(e) {
        e.stopPropagation();
        if (_this2.state.brushInteractionMode) {
          if (_this2.state.brushInteractionMode === 'move') {
            onSimpleClick(getEventCoordinates(e));
          }
        }
      };

      var onContainerClick = function onContainerClick(e) {
        e.stopPropagation();
        if (_this2.state.brushingContainer === false && !_this2.state.brushInteractionMode) {
          onSimpleClick(getEventCoordinates(e));
        }

        if (_this2.state.brushingContainer) {
          _this2.setState({
            brushingContainer: false
          });
        }
        if (_this2.state.canBrushContainer) {
          _this2.setState({
            canBrushContainer: false
          });
        }
        if (_this2.state.brushInteractionMode) {
          _this2.setState({
            brushInteractionMode: undefined
          });
        }
      };
      var onContainerMouseDown = function onContainerMouseDown(e) {
        e.stopPropagation();
        if (!_this2.state.canBrushContainer) {
          _this2.setState({
            canBrushContainer: true
          });
        }
        _this2.setState({
          containerBrushStartPosition: undefined
        });
      };
      var onContainerMouseMove = function onContainerMouseMove(e) {
        e.stopPropagation();
        var eventPosition = getEventCoordinates(e);
        if (_this2.state.canBrushContainer) {
          if (!_this2.state.brushingContainer) {
            _this2.setState({
              brushingContainer: true,
              containerBrushStartPosition: eventPosition
            });
          } else {
            var currentPosition = getEventCoordinates(e);
            var from = _this2.state.containerBrushStartPosition;
            var to = currentPosition;
            if (from && to && from.portionY >= 0 && from.portionY <= 1 && to.portionY >= 0 && to.portionY <= 1) {
              var fromOutput = _this2.state.containerBrushStartPosition.portionY < currentPosition.portionY ? _this2.state.containerBrushStartPosition : currentPosition;
              var toOutput = currentPosition.portionY > _this2.state.containerBrushStartPosition.portionY ? currentPosition : _this2.state.containerBrushStartPosition;
              onSpanEventDefinition(fromOutput, toOutput);
            }
          }
        } else if (_this2.state.brushingContainer) {
          _this2.setState({
            brushingContainer: false
          });
        }

        if (_this2.state.brushInteractionMode === 'resize-top') {
          onSpanEventDefinition(undefined, { portionY: eventPosition.portionY });
        } else if (_this2.state.brushInteractionMode === 'resize-bottom') {
          onSpanEventDefinition({ portionY: eventPosition.portionY }, undefined);
        } else if (_this2.state.brushInteractionMode === 'move') {
          if (!_this2.state.brushMoveStartPosition) {
            _this2.setState({
              brushMoveStartPosition: eventPosition
            });
          } else {
            onBrushMouseMove(e);
          }
        }
      };

      var onBrushMouseDown = function onBrushMouseDown(e) {
        e.stopPropagation();
        if (!_this2.state.brushInteractionMode) {
          var position = getEventCoordinates(e);
          var interactionMode = void 0;
          var moveStartPosition = void 0;
          if (position.portionY < 0.2) {
            interactionMode = 'resize-top';
          } else if (position.portionY > 0.8) {
            interactionMode = 'resize-bottom';
          } else {
            interactionMode = 'move';
            moveStartPosition = position;
          }
          _this2.setState({
            brushInteractionMode: interactionMode,
            brushMoveStartPosition: moveStartPosition
          });
        }
      };
      var onBrushClick = function onBrushClick(e) {
        e.stopPropagation();
        _this2.setState({
          brushInteractionMode: undefined
        });
      };

      return allowBrush ? _react2.default.createElement(
        'div',
        {
          className: 'brush-placeholder',
          onClick: onContainerClick,
          onMouseDown: onContainerMouseDown,
          onMouseMove: onContainerMouseMove,
          onMouseLeave: onContainerLeave },
        _react2.default.createElement('div', {
          className: 'brush',
          onClick: onBrushClick,
          onMouseDown: onBrushMouseDown,
          style: {
            top: scale(fromDate) + '%',
            height: scale(toDate) - scale(fromDate) + '%',
            pointerEvents: this.state.brushingContainer || this.state.brushInteractionMode ? 'none' : 'all'
          } })
      ) : _react2.default.createElement(
        'div',
        {
          className: 'brush-placeholder' },
        _react2.default.createElement('div', {
          className: 'brush',
          style: {
            top: scale(fromDate) + '%',
            height: scale(toDate) - scale(fromDate) + '%',
            pointerEvents: 'none'
          } })
      );
    }
  }]);

  return Brush;
}(_react2.default.Component);