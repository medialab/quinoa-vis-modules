/**
 * This module transforms string data to a normalized js representation
 * of map data, able to be subjected to a mapping process
 * @module utils/mapDataParser
 */
import {omit} from 'lodash';
import {csvParse} from 'd3-dsv';

/**
 * Recursively finds coordinate couples and reverse them
 * @param {array} coordinates - array of values or arrays representing coordinates
 * @return {array} newArray - the reversed set of coordinates
 */
export const reverseCoordinates = (coordinates) => {
  if (Array.isArray(coordinates)) {
    if (Array.isArray(coordinates[0])) {
        return coordinates.map(reverseCoordinates);
    }
 else {
      return coordinates.reverse();
    }
  }
};

/**
 * Maps a geojson file to a flat array of normalized features, and make coordinates compliant with leaflet needs (geoJSON describes coordinates as X,Y, whereas leaflet maps them as Lat-Lng)
 * @param {object} geojson data - native geojson-structured data
 * @return {array} newData - ready-to-be-used data
 */
export const flattenGeoJSON = (data) => {
  if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
    return data.features.map(feature => {
      const properties = omit(feature.properties, ['_storage_options']);
      const coordinates = reverseCoordinates(feature.geometry.coordinates);
      return {
        ...properties,
        geometry: {...feature.geometry, coordinates}
      };
    });
  }
  return [];
};

/**
 * Turns str data to normalized js data
 * @param {string} str - original data to parse
 * @param {string} dataFormat - known format of the data string - in ['csv', 'geoJSON']
 * @return {array} newData - ready-to-be-used data
 */
export default function parseData (str = '', dataFormat = 'csv') {
  if (dataFormat === 'csv') {
    return {
      main: csvParse(str)
              // comply to geojson-feature-like data structure
              .map(input => {
                const object = {...input};
                const latitude = object.latitude;
                const longitude = object.longitude;
                delete object.latitude;
                delete object.longitude;
                return {
                  ...object,
                  geometry: {
                    type: 'Point',
                    coordinates: [+latitude, +longitude]
                  }
                };
              })
    };
  }
 else if (dataFormat === 'geojson') {
    try {
      const data = JSON.parse(str);
      return {
        main: flattenGeoJSON(data)
      };
    }
   catch (e) {
    return undefined;
   }
  }
}

/*
 * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
 */
// dataMap: PropTypes.shape({
//   latitude: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   longitude: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   title: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   category: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ])
// }),
