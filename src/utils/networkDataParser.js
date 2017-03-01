/**
 * This module transforms string data to a normalized js representation
 * of network data, able to be subjected to a mapping process
 * @module utils/networkDataParser
 */
import gexf from 'gexf/src/parser';
import converter from 'xml-js';

/**
 * Turns graphML raw string data to a json representation
 * @param {string} str - input string
 * @return {object} newData - object with nodes and edges props
 */
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

/**
 * Turns incoming string data to a json representation
 * @param {string} str - input string
 * @param {string} dataFormat - incoming data format - in ['gexf', 'json', 'graphML']
 * @return {object} newData - object with nodes and edges props
 */
export default function parseData (str = '', dataFormat = 'gexf') {
  let normalizedData = {
    edges: [],
    nodes: []
  };
  if (dataFormat === 'gexf') {
    const domised = new DOMParser().parseFromString(str, 'application/xml');
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
 else if (dataFormat === 'json') {
    try {
      const data = JSON.parse(str);
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
 catch (e) {
      return undefined;
    }
  }
  else if (dataFormat === 'graphml') {
    normalizedData = parseGraphML(str);
  }
  else {
    // todo : handle unsupported data structures ?
  }
  return normalizedData;
}
