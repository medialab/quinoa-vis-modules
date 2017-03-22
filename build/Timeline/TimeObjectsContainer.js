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

var _TimeObject = require('./TimeObject');

var _TimeObject2 = _interopRequireDefault(_TimeObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObjectsContainer = function (_Component) {
  _inherits(ObjectsContainer, _Component);

  function ObjectsContainer(props) {
    _classCallCheck(this, ObjectsContainer);

    var _this = _possibleConstructorReturn(this, (ObjectsContainer.__proto__ || Object.getPrototypeOf(ObjectsContainer)).call(this, props));

    _this.update = _this.update.bind(_this);
    _this.state = {
      scaleX: undefined,
      timeObjects: []
    };
    return _this;
  }

  _createClass(ObjectsContainer, [{
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
    key: 'update',
    value: function update(next) {
      var width = next.width,
          height = next.height,
          timeBoundaries = next.timeBoundaries;


      var timeObjects = next.data || [];
      var columnsCount = (0, _d3Array.max)(timeObjects, function (d) {
        return d.column;
      });
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
      var _props = this.props,
          viewParameters = _props.viewParameters,
          width = _props.width,
          height = _props.height,
          transitionsDuration = _props.transitionsDuration,
          transform = _props.transform,
          selectedObjectId = _props.selectedObjectId,
          onObjectSelection = _props.onObjectSelection;
      var _state = this.state,
          scaleX = _state.scaleX,
          scaleY = _state.scaleY,
          timeObjects = _state.timeObjects,
          columnWidth = _state.columnWidth;


      return scaleX && scaleY && width && height ? _react2.default.createElement(
        'g',
        {
          className: 'objects-container',
          transform: transform || '' },
        timeObjects.map(function (timeObject, index) {
          var onClick = function onClick() {
            if (typeof onObjectSelection === 'function') {
              onObjectSelection(timeObject.id);
            }
          };
          return _react2.default.createElement(_TimeObject2.default, {
            timeObject: timeObject,
            key: index,
            onSelection: onClick,
            scaleX: scaleX,
            scaleY: scaleY,
            columnWidth: columnWidth,
            selected: selectedObjectId === timeObject.id,
            color: viewParameters.colorsMap.main && viewParameters.colorsMap.main[timeObject.category] || viewParameters.colorsMap.main.default || viewParameters.colorsMap.default,
            transitionsDuration: transitionsDuration });
        })
      ) : null;
    }
  }]);

  return ObjectsContainer;
}(_react.Component);

exports.default = ObjectsContainer;