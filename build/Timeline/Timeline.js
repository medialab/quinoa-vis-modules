'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.mapData = _this.mapData.bind(_this);
    _this.mapData(_this.props.data, _this.props.dataMap);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      // remap data if data or datamap will change
      if (this.props.data !== nextProps.data || this.props.dataMap !== nextProps.dataMap) {
        this.mapData(nextProps.data, nextProps.dataMap);
      }
    }

    /*
     * Maps incoming data with provided data map
     */

  }, {
    key: 'mapData',
    value: function mapData(data, dataMap) {
      this.data = data.map(function (datapoint) {
        return Object.keys(dataMap).reduce(function (obj, dataKey) {
          return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap[dataKey] === 'function' ? dataMap[dataKey](datapoint) // case accessor
          : datapoint[dataMap[dataKey]]));
        }, {});
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          _props$viewParameters = _props.viewParameters,
          viewParameters = _props$viewParameters === undefined ? {} : _props$viewParameters,
          onViewChange = _props.onViewChange;
      var data = this.data;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('button', { onClick: onViewChange() }),
        JSON.stringify(viewParameters, null, 2),
        JSON.stringify(data, null, 2)
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

Timeline.propTypes = {
  /*
   * Incoming data in json format
   */
  data: _react.PropTypes.oneOfType[_react.PropTypes.array],
  /*
   * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
   */
  dataMap: _react.PropTypes.shape({
    name: _react.PropTypes.string,
    category: _react.PropTypes.string,
    year: _react.PropTypes.number,
    month: _react.PropTypes.number,
    day: _react.PropTypes.number,
    time: _react.PropTypes.number,
    endYear: _react.PropTypes.number,
    endMonth: _react.PropTypes.number,
    endDay: _react.PropTypes.number,
    endTime: _react.PropTypes.number
  }),
  /*
   * object describing the current view (some being exposed to user interaction like zoom and pan params, others not - like Timeline spatialization algorithm for instance)
   */
  viewParameters: _react.PropTypes.shape({
    fromData: _react.PropTypes.date,
    toDate: _react.PropTypes.instanceOf(Date)
  }),
  /*
   * boolean to specify whether the user can pan/zoom/interact or not with the view
   */
  allowViewChange: _react.PropTypes.bool,
  /*
   * callback fn triggered when user changes view parameters, callbacks data about the triggering interaction and about the new view parameters
   */
  onViewChange: _react.PropTypes.func
};

exports.default = Timeline;