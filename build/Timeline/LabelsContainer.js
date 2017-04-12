'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

var _Label = require('./Label');

var _Label2 = _interopRequireDefault(_Label);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LabelsContainer = function (_Component) {
  _inherits(LabelsContainer, _Component);

  function LabelsContainer(props) {
    _classCallCheck(this, LabelsContainer);

    var _this = _possibleConstructorReturn(this, (LabelsContainer.__proto__ || Object.getPrototypeOf(LabelsContainer)).call(this, props));

    _this.update = _this.update.bind(_this);
    _this.state = {
      scaleX: undefined,
      timeObjects: [],
      hoveredLabelId: undefined
    };
    _this.toggleLabelHover = _this.toggleLabelHover.bind(_this);
    return _this;
  }

  _createClass(LabelsContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var props = this.props,
          state = this.state,
          update = this.update;

      update(props, props, state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(next) {
      var props = this.props,
          update = this.update;

      if (props !== next) {
        update(next);
      }
    }
  }, {
    key: 'toggleLabelHover',
    value: function toggleLabelHover(objectId, value) {
      if (!value) {
        this.setState({
          hoveredLabelId: undefined
        });
      } else {
        var hoveredIndex = void 0;
        var hovered = void 0;
        this.state.timeObjects.some(function (timeObject, index) {
          if (timeObject.id === objectId) {
            hoveredIndex = index;
            hovered = timeObject;
            return true;
          }
        });
        var timeObjects = [].concat(_toConsumableArray(this.state.timeObjects.slice(0, hoveredIndex)), _toConsumableArray(this.state.timeObjects.slice(hoveredIndex + 1)), [hovered]);
        this.setState({
          hoveredLabelId: objectId,
          timeObjects: timeObjects
        });
      }
    }
  }, {
    key: 'update',
    value: function update(next) {
      var width = next.width,
          height = next.height,
          timeBoundaries = next.timeBoundaries;


      var timeObjects = next.data || [];
      var columnsCount = (0, _d3Array.max)(timeObjects, function (d) {
        return d.column;
      }) + 1;
      var columnWidth = width / columnsCount;

      this.setState({
        scaleX: (0, _d3Scale.scaleLinear)().domain([0, columnsCount + 1]).range([0, width]),
        scaleY: (0, _d3Scale.scaleLinear)().domain([timeBoundaries[0], timeBoundaries[1]]).range([0, height]),
        columnWidth: columnWidth,
        timeObjects: timeObjects
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          viewParameters = _props.viewParameters,
          width = _props.width,
          height = _props.height,
          transitionsDuration = _props.transitionsDuration,
          transform = _props.transform,
          onLabelsHovered = _props.onLabelsHovered,
          onObjectSelection = _props.onObjectSelection;
      var _state = this.state,
          scaleX = _state.scaleX,
          scaleY = _state.scaleY,
          timeObjects = _state.timeObjects,
          columnWidth = _state.columnWidth;

      return scaleX && scaleY && width && height ? _react2.default.createElement(
        'g',
        {
          className: 'labels-container',
          transform: transform || '',
          onMouseEnter: onLabelsHovered },
        timeObjects.map(function (timeObject, index) {
          return _react2.default.createElement(_Label2.default, {
            timeObject: timeObject,
            key: index,
            scaleX: scaleX,
            scaleY: scaleY,
            columnWidth: columnWidth,
            screenHeight: height,
            screenWidth: width,
            shown: viewParameters.shownCategories ? timeObject.category && viewParameters.shownCategories.main.find(function (cat) {
              return timeObject.category + '' === cat + '';
            }) !== undefined : true,
            color: viewParameters.colorsMap.main && viewParameters.colorsMap.main[timeObject.category] || viewParameters.colorsMap.main.default || viewParameters.colorsMap.default,
            transitionsDuration: transitionsDuration,
            toggleLabelHover: _this2.toggleLabelHover,
            onObjectSelection: onObjectSelection,
            selected: viewParameters.selectedObjectId === timeObject.id });
        })
      ) : null;
    }
  }]);

  return LabelsContainer;
}(_react.Component);

exports.default = LabelsContainer;