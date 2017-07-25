/**
 * This module consumes normalized data with a data map to build ready-to-visualize data
 * @module quinoa-vis-modules/utils/networkDataMapper
 */

 /**
 * Creates a hash from an id
 * @param {str||number} id - the id to process
 * @return {number} hash - resulting number hash
 */
const idToCoords = (id) => {
  const str = id + '';
  let hash = 0;
  let i;
  let chr;
  let len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * Maps incoming data with provided data map
 * @param {object} normalizedData - incoming data made of of nodes and edges arrays
 * @param {object} dataMap - list of correspondance between output data needs and input data key names / accessors fns
 * @return {object} newData - ready-to-be-used data (object with nodes and edges props)
 */
export default function mapData (normalizedData = {nodes: [], edges: []}, dataMap = {nodes: [], edges: []}) {
  const mappedData = {
    nodes: dataMap.nodes ?
      normalizedData.nodes.map(datapoint => {
        return Object.keys(dataMap.nodes).reduce((obj, dataKey) => {
          return {
            ...obj,
            [dataKey]: typeof dataMap.nodes[dataKey] === 'function' ?
                        dataMap.nodes[dataKey](datapoint) // case accessor
                        : datapoint[dataMap.nodes[dataKey]] // case prop name
          };
        }, {
          // sigma indispensable props
          id: datapoint.id,
          x: datapoint.x,
          y: datapoint.y,
          size: datapoint.size || 0.1
        });
      }) : normalizedData.nodes,
    edges: dataMap.edges ?
      normalizedData.edges.map(datapoint => {
        return Object.keys(dataMap.edges).reduce((obj, dataKey) => {
          return {
            ...obj,
            [dataKey]: typeof dataMap.edges[dataKey] === 'function' ?
                        dataMap.edges[dataKey](datapoint) // case accessor
                        : datapoint[dataMap.edges[dataKey]] // case prop name
          };
        }, {
          id: datapoint.id,
          source: datapoint.source,
          target: datapoint.target,
        });
      }) : normalizedData.edges,
  };
  // check if nodes are already spatialized
  const nodeNotSpatialized = mappedData.nodes.find(node => node.x === undefined && node.y === undefined);
  mappedData.spatialized = nodeNotSpatialized === undefined;
  // if not, attribute them coordinates in a spatialization-friendly way
  if (mappedData.spatialized === false) {
    mappedData.nodes = mappedData.nodes.map(node => ({
      ...node,
      // this ensures that points will start from the same position at each forceAtlas spatialization start
      // and therefore to control the position of elements on graph even if no positions are provided in the data
      x: Math.cos(idToCoords(node.id)),
      y: Math.sin(-idToCoords(node.id))
    }));
  }
  return mappedData;
}

/*
 * Dictionary that specifies how to map vis props to data attributes (key names or accessor funcs)
 */
// dataMap: PropTypes.shape({
//   nodes: PropTypes.shape({
//     label: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ]),
//     category: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ]),
//     description: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ]),
//     size: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ])
//   }),
//   edges: PropTypes.shape({
//     label: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ]),
//     // one-side directed, two-side directed, undirected
//     type: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ]),
//     category: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ]),
//     description: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ]),
//     weight: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.func
//     ])
//   })
// })
