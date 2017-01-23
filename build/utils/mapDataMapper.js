'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = mapMapData;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


function mapMapData() {
  var normalizedData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { main: [] };
  var dataMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { main: {} };

  return normalizedData.main.map(function (datapoint) {
    return Object.keys(dataMap.main).reduce(function (obj, dataKey) {
      return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap.main[dataKey] === 'function' ? dataMap.main[dataKey](datapoint) 
      : datapoint[dataMap.main[dataKey]]));
    }, {
      geometry: datapoint.geometry
    });
  });
}