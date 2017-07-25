/**
 * This module transforms string data to a normalized js representation
 * of timeline data, able to be subjected to a mapping process
 * @module quinoa-vis-modules/utils/timelineDataParser
 */
import {csvParse} from 'd3-dsv';


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
    };
  }
}

/*
 * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
 */
// dataMap: PropTypes.shape({
//   name: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   category: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   year: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   month: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   day: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   time: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   endYear: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   endMonth: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   endDay: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
//   endTime: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.func
//   ]),
// }),
// fromDate: PropTypes.oneOfType([
//   PropTypes.instanceOf(Date),
//   PropTypes.number
// ]),
// toDate: PropTypes.oneOfType([
//   PropTypes.instanceOf(Date),
//   PropTypes.number
// ]),
