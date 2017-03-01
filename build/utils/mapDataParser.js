'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenGeoJSON = exports.reverseCoordinates = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; 


exports.default = parseData;

var _lodash = require('lodash');

var _d3Dsv = require('d3-dsv');

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

function parseData() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var dataFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'csv';

  if (dataFormat === 'csv') {
    return {
      main: (0, _d3Dsv.csvParse)(str)
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
      })
    };
  } else if (dataFormat === 'geojson') {
    try {
      var data = JSON.parse(str);
      return {
        main: flattenGeoJSON(data)
      };
    } catch (e) {
      return undefined;
    }
  }
}

