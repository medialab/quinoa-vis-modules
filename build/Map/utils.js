'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mapData = function mapData(data, dataMap) {
  var dataStructure = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flatArray';

  if (dataStructure === 'flatArray') {
    return data.map(function (datapoint) {
      return Object.keys(dataMap).reduce(function (obj, dataKey) {
        return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap[dataKey] === 'function' ? dataMap[dataKey](datapoint) 
        : datapoint[dataMap[dataKey]]));
      }, {});
    });
  } else {
    return data;
  }
};

var computeDataRelatedState = exports.computeDataRelatedState = function computeDataRelatedState(inputData, dataMap, viewParameters, dataStructure) {
  var data = mapData(inputData, dataMap, dataStructure);
  return {
    data: data,
    viewParameters: viewParameters
  };
};