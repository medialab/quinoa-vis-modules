'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactVisjsTimeline = require('react-visjs-timeline');

var _reactVisjsTimeline2 = _interopRequireDefault(_reactVisjsTimeline);

require('./Timeline.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Timeline = function Timeline(_ref) {
  var _ref$data = _ref.data,
      data = _ref$data === undefined ? [] : _ref$data,
      _ref$viewParameters = _ref.viewParameters,
      viewParameters = _ref$viewParameters === undefined ? {} : _ref$viewParameters,
      updateView = _ref.updateView;

  var range = void 0;
  if (Object.keys(viewParameters).length) {
    range = {
      start: viewParameters && new Date(viewParameters.fromDate),
      end: viewParameters && new Date(viewParameters.toDate)
    };
  } else if (data.length) {
    var min = Math.min.apply(Math, data.map(function (point) {
      return point.start;
    }));
    var max = Math.max.apply(Math, data.map(function (point) {
      return point.start;
    }));
    var dist = max - min;
    range = {
      start: new Date(min - dist / 4),
      end: new Date(max + dist / 4)
    };
  } else {
    range = {
      start: new Date(0),
      end: new Date()
    };
  }

  var animation = {
    duration: 100,
    easingFunction: 'easeInQuint'
  };

  var options = {
    width: '100%',
    height: '100%',
    stack: true,
    showMajorLabels: false,
    showCurrentTime: false,

    type: 'point',
    format: {
      minorLabels: {
        minute: 'h:mma',
        hour: 'ha'
      }
    },
    start: range.start,
    end: range.end
  };

  function onRange(props) {
    if (props.byUser) {
      var params = { fromDate: props.start.getTime(), toDate: props.end.getTime() };
      updateView(params);
    }
  }

  return _react2.default.createElement(_reactVisjsTimeline2.default, {
    options: options,
    rangechangedHandler: onRange,
    items: data,
    animation: animation });
};

exports.default = Timeline;