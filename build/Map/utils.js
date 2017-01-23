'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeDataRelatedState = exports.mapData = exports.flattenGeoJSON = exports.reverseCoordinates = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reverseCoordinates = exports.reverseCoordinates = function reverseCoordinates(coordinates) {
  if (Array.isArray(coordinates)) {
    if (Array.isArray(coordinates[0])) {
      return coordinates.map(reverseCoordinates);
    } else {
      return coordinates.reverse();
    }
  }
};

var flattenGeoJSON = exports.flattenGeoJSON = function flattenGeoJSON(data) {
  if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
    return data.features.map(function (feature) {
      var properties = (0, _lodash.omit)(feature.properties, ['_storage_options']);
      var coordinates = reverseCoordinates(feature.geometry.coordinates);
      return _extends({}, properties, {
        geometry: _extends({}, feature.geometry, { coordinates: coordinates })
      });
    });
  }
  return [];
};

var mapData = exports.mapData = function mapData(data, dataMap) {
  var dataStructure = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flatArray';

  if (dataStructure === 'flatArray') {
    return data.map(function (datapoint) {
      return Object.keys(dataMap).reduce(function (obj, dataKey) {
        return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap[dataKey] === 'function' ? dataMap[dataKey](datapoint) 
        : datapoint[dataMap[dataKey]]));
      }, {});
    })
    .map(function (input) {
      var object = _extends({}, input);
      var latitude = object.latitude;
      var longitude = object.longitude;
      delete object.latitude;
      delete object.longitude;
      return _extends({}, object, {
        geometry: {
          type: 'Point',
          coordinates: [+latitude, +longitude]
        }
      });
    });
  } else if (dataStructure === 'geoJSON') {
    return flattenGeoJSON(data).map(function (datapoint) {
      return Object.keys(dataMap).reduce(function (obj, dataKey) {
        return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap[dataKey] === 'function' ? dataMap[dataKey](datapoint) 
        : datapoint[dataMap[dataKey]]));
      }, {
        geometry: datapoint.geometry
      });
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