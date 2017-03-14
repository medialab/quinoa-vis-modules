/**
 * This module consumes normalized data with a data map to build ready-to-visualize data
 * @module utils/mapDataMapper
 */

/**
 * Maps incoming normalized with provided data map
 * @param {object} normalizedData
 * @param {object} dataMap - list of correspondance between output data needs and input data key names / accessors fns
 * @return {array} newData - ready-to-be-used data
 */
export default function mapMapData (normalizedData = {main: []}, dataMap = {main: {}}) {
  return {
    main: normalizedData.main.map(datapoint => {
      return Object.keys(dataMap.main).reduce((obj, dataKey) => {
              return {
                ...obj,
                [dataKey]: typeof dataMap.main[dataKey] === 'function' ?
                            dataMap.main[dataKey](datapoint) // case accessor
                            : datapoint[dataMap.main[dataKey]] // case prop name
              };
            }, {
              geometry: datapoint.geometry
            });
    })};
}
