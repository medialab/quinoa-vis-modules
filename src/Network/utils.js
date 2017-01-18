import gexf from 'gexf/src/parser';

import converter from 'xml-js';

const parseGraphML = (str = '') => {
  try {
    const json = converter.xml2json(str);
    const representation = JSON.parse(json);
    if (representation.elements && representation.elements[0]) {
      const data = representation.elements[0];
      if (data.name === 'graphml') {
        const elements = data.elements.find(e => e.name === 'graph');
        if (elements) {
          const graphObjects = elements.elements;
          // const edgeDirectionDefault = (elements.attributes.edgedefault);
          const nodes = graphObjects.filter(element => element.name === 'node')
                .map(node => {
                  const id = node.attributes.id;
                  let props = {};
                  if (node.elements) {
                    props = node.elements.reduce((pr, element) => ({
                      ...pr,
                      [element.attributes.key]: element.elements && element.elements[0].text
                    }), {});
                  }
                  return {
                    id,
                    ...props
                  };
                });
          const edges = graphObjects.filter(element => element.name === 'edge')
                .map(edge => {
                  const id = edge.attributes.id;
                  const source = edge.attributes.source;
                  const target = edge.attributes.target;
                  const directed = edge.attributes.directed;
                  const name = edge.elements && edge.elements[0] && edge.elements[0].elements[0] && edge.elements[0].elements[0].text;
                  return {
                    id,
                    source,
                    target,
                    directed,
                    name
                  };
                });
          return {nodes, edges};
        }
      }
      return data;
    }
  }
 catch (e) {
    return undefined;
  }
  return undefined;
};

export const parseData = (data, dataStructure) => {
  let normalizedData = {
    edges: [],
    nodes: []
  };
  if (dataStructure === 'gexf') {
    const domised = new DOMParser().parseFromString(data, 'application/xml');
    const parsed = gexf.parse(domised);
    // consume node model if present
    if (parsed.model.node) {
      normalizedData.nodes = parsed.nodes.map(node => {
        let newNode = {
          ...node,
          ...parsed.model.node.reduce((result, mapper) => {
            const attribute = node.attributes[mapper.id];
            return {
              ...result,
              [mapper.title]: attribute
            };
          }, {}),
          ...node.viz,
        };
        if (node.viz && node.viz.position) {
          newNode = {
            ...newNode,
            ...node.viz.position
          };
        }
        delete newNode.attributes;
        delete newNode.viz;
        return newNode;
      });
    }
    else {
      normalizedData.nodes = parsed.nodes.slice();
    }
    // consume link model if present
    if (parsed.model.edge) {
      normalizedData.edges = parsed.edges.map(edge => ({
        ...edge,
        ...parsed.model.edge.reduce((result, mapper) => {
          const attribute = edge.attributes[mapper.id];
          return {
            ...result,
            [mapper.title]: attribute
          };
        }, {})
      }));
    }
    else {
      normalizedData.edges = parsed.edges.slice();
    }
  // normalizing data in json format (with supposition that it may come from d3-like structured json)
  }
 else if (dataStructure === 'json') {
    if (data.links) {
      normalizedData.edges = data.links.slice();
    }
 else if (data.edges) {
      normalizedData.edges = data.edges.slice();
    }

    normalizedData.edges = normalizedData.edges.map((edge, id) => {
      if (!edge.id) {
        return {
          ...edge,
          id
        };
      }
      else return edge;
    });

    if (data.nodes) {
      normalizedData.nodes = data.nodes.slice().map((node, id) => {
        if (!node.id) {
          return {
            ...node,
            id
          };
        }
        else return node;
      });
    }
  }
 else if (dataStructure === 'graphML') {
    normalizedData = parseGraphML(data);
  }
 else {
    // todo : handle unsupported data structures ?
  }
  return normalizedData;
};

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
 * @param {array} data - list of time objects
 * @param {object} dataMap - list of correspondance between output data needs and input data key names / accessors fns
 * @param {string} dataStructure - expression specifying how data is structured
 * @return {array} newData - ready-to-be-used data
 */
export const mapData = (data, dataMap, dataStructure = 'gexf') => {
  /*
   * Step : normalize data to a json representation as an object
   * containing an "edges" and a "nodes" array props
   */
  const normalizedData = parseData(data, dataStructure);

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
  // decide whether it is needed to launch forceAtlas (== all nodes are at 0,0)
  const nodeNotSpatialized = mappedData.nodes.find(node => node.x === undefined && node.y === undefined);
  mappedData.spatialized = nodeNotSpatialized === undefined;
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
};

