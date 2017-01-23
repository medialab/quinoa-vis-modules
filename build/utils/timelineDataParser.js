'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseData;

var _d3Dsv = require('d3-dsv');

function parseData() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var dataFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'csv';

  if (dataFormat === 'csv') {
    return {
      main: (0, _d3Dsv.csvParse)(str)
    };
  }
}

