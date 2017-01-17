import {omit} from 'lodash';

/**
 * Recursively finds coordinate couples and reverse them
 * @param {array} coordinates - array of values or arrays representing coordinates
 * @return {array} newArray - the reversed set of coordinates
 */
const reverseCoordinates = (coordinates) => {
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
const flattenGeoJSON = (data) => {
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
 * Maps incoming data with provided data map
 * @param {array} data - list of time objects
 * @param {object} dataMap - list of correspondance between output data needs and input data key names / accessors fns
 * @param {string} dataStructure - expression specifying how data is structured
 * @return {array} newData - ready-to-be-used data
 */
const mapData = (data, dataMap, dataStructure = 'flatArray') => {
  if (dataStructure === 'flatArray') {
    return data.map(datapoint => {
      return Object.keys(dataMap).reduce((obj, dataKey) => {
        return {
          ...obj,
          [dataKey]: typeof dataMap[dataKey] === 'function' ?
                      dataMap[dataKey](datapoint) // case accessor
                      : datapoint[dataMap[dataKey]] // case prop name
        };
      }, {});
    })
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
    });
  }
  else if (dataStructure === 'geoJSON') {
    return flattenGeoJSON(data)
      .map(datapoint => {
        return Object.keys(dataMap).reduce((obj, dataKey) => {
          return {
            ...obj,
            [dataKey]: typeof dataMap[dataKey] === 'function' ?
                        dataMap[dataKey](datapoint) // case accessor
                        : datapoint[dataMap[dataKey]] // case prop name
          };
        }, {
          geometry: datapoint.geometry
        });
      });
  }
  else {
    return data;
  }
};

/**
 * Compute multiple map-related representations and utils out of a couple of data+dataMap
 * @param {array} inputData - initial data
 * @param {object} dataMap - list of correspondance between output data needs and input data key names / accessors fns
 * @param {object} viewParameters - initial view parameters
 * @return {array} stateRepresentation - invariant timeline-related state elements to be used when initing / reloading data or dataMap into component
 */
export const computeDataRelatedState = (inputData, dataMap, viewParameters, dataStructure) => {
    const data = mapData(inputData, dataMap, dataStructure);
    return {
      data,
      viewParameters
    };
};
