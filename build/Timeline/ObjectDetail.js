'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMarkdown = require('react-markdown');

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjectDetail = function ObjectDetail(_ref) {
  var active = _ref.active,
      timeObject = _ref.timeObject,
      formatDate = _ref.formatDate;
  return _react2.default.createElement(
    'div',
    { className: 'object-detail-container' + (active ? ' active' : '') },
    timeObject ? _react2.default.createElement(
      'div',
      { className: 'object-detail-contents' },
      _react2.default.createElement(
        'div',
        { className: 'header' },
        _react2.default.createElement(
          'p',
          null,
          formatDate(timeObject.startDate),
          timeObject.endDate ? ' - ' + formatDate(timeObject.endDate) : null
        ),
        _react2.default.createElement(
          'h2',
          null,
          timeObject.title
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'content' },
        timeObject.description ? _react2.default.createElement(_reactMarkdown2.default, { input: timeObject.description }) : null,
        timeObject.source ? _react2.default.createElement(
          'div',
          { className: 'source' },
          _react2.default.createElement(
            'h4',
            null,
            'Sources'
          ),
          _react2.default.createElement(_reactMarkdown2.default, { input: timeObject.source })
        ) : null
      )
    ) : null
  );
};

exports.default = ObjectDetail;