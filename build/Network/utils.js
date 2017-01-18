'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapData = exports.parseData = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _parser = require('gexf/src/parser');

var _parser2 = _interopRequireDefault(_parser);

var _xmlJs = require('xml-js');

var _xmlJs2 = _interopRequireDefault(_xmlJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var parseGraphML = function parseGraphML() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  try {
    var json = _xmlJs2.default.xml2json(str);
    var representation = JSON.parse(json);
    if (representation.elements && representation.elements[0]) {
      var data = representation.elements[0];
      if (data.name === 'graphml') {
        var elements = data.elements.find(function (e) {
          return e.name === 'graph';
        });
        if (elements) {
          var graphObjects = elements.elements;
          var nodes = graphObjects.filter(function (element) {
            return element.name === 'node';
          }).map(function (node) {
            var id = node.attributes.id;
            var props = {};
            if (node.elements) {
              props = node.elements.reduce(function (pr, element) {
                return _extends({}, pr, _defineProperty({}, element.attributes.key, element.elements && element.elements[0].text));
              }, {});
            }
            return _extends({
              id: id
            }, props);
          });
          var edges = graphObjects.filter(function (element) {
            return element.name === 'edge';
          }).map(function (edge) {
            var id = edge.attributes.id;
            var source = edge.attributes.source;
            var target = edge.attributes.target;
            var directed = edge.attributes.directed;
            var name = edge.elements && edge.elements[0] && edge.elements[0].elements[0] && edge.elements[0].elements[0].text;
            return {
              id: id,
              source: source,
              target: target,
              directed: directed,
              name: name
            };
          });
          return { nodes: nodes, edges: edges };
        }
      }
      return data;
    }
  } catch (e) {
    return undefined;
  }
  return undefined;
};

var parseData = exports.parseData = function parseData(data, dataStructure) {
  var normalizedData = {
    edges: [],
    nodes: []
  };
  if (dataStructure === 'gexf') {
    (function () {
      var domised = new DOMParser().parseFromString(data, 'application/xml');
      var parsed = _parser2.default.parse(domised);
      if (parsed.model.node) {
        normalizedData.nodes = parsed.nodes.map(function (node) {
          var newNode = _extends({}, node, parsed.model.node.reduce(function (result, mapper) {
            var attribute = node.attributes[mapper.id];
            return _extends({}, result, _defineProperty({}, mapper.title, attribute));
          }, {}), node.viz);
          if (node.viz && node.viz.position) {
            newNode = _extends({}, newNode, node.viz.position);
          }
          delete newNode.attributes;
          delete newNode.viz;
          return newNode;
        });
      } else {
        normalizedData.nodes = parsed.nodes.slice();
      }
      if (parsed.model.edge) {
        normalizedData.edges = parsed.edges.map(function (edge) {
          return _extends({}, edge, parsed.model.edge.reduce(function (result, mapper) {
            var attribute = edge.attributes[mapper.id];
            return _extends({}, result, _defineProperty({}, mapper.title, attribute));
          }, {}));
        });
      } else {
        normalizedData.edges = parsed.edges.slice();
      }
    })();
  } else if (dataStructure === 'json') {
    if (data.links) {
      normalizedData.edges = data.links.slice();
    } else if (data.edges) {
      normalizedData.edges = data.edges.slice();
    }

    normalizedData.edges = normalizedData.edges.map(function (edge, id) {
      if (!edge.id) {
        return _extends({}, edge, {
          id: id
        });
      } else return edge;
    });

    if (data.nodes) {
      normalizedData.nodes = data.nodes.slice().map(function (node, id) {
        if (!node.id) {
          return _extends({}, node, {
            id: id
          });
        } else return node;
      });
    }
  } else if (dataStructure === 'graphML') {
    normalizedData = parseGraphML(data);
  } else {
  }
  return normalizedData;
};

var idToCoords = function idToCoords(id) {
  var str = id + '';
  var hash = 0;
  var i = void 0;
  var chr = void 0;
  var len = void 0;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; 
  }
  return hash;
};

var mapData = exports.mapData = function mapData(data, dataMap) {
  var dataStructure = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'gexf';

  var normalizedData = parseData(data, dataStructure);

  var mappedData = {
    nodes: dataMap.nodes ? normalizedData.nodes.map(function (datapoint) {
      return Object.keys(dataMap.nodes).reduce(function (obj, dataKey) {
        return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap.nodes[dataKey] === 'function' ? dataMap.nodes[dataKey](datapoint) 
        : datapoint[dataMap.nodes[dataKey]]));
      }, {
        id: datapoint.id,
        x: datapoint.x,
        y: datapoint.y,
        size: datapoint.size || 0.1
      });
    }) : normalizedData.nodes,
    edges: dataMap.edges ? normalizedData.edges.map(function (datapoint) {
      return Object.keys(dataMap.edges).reduce(function (obj, dataKey) {
        return _extends({}, obj, _defineProperty({}, dataKey, typeof dataMap.edges[dataKey] === 'function' ? dataMap.edges[dataKey](datapoint) 
        : datapoint[dataMap.edges[dataKey]]));
      }, {
        id: datapoint.id,
        source: datapoint.source,
        target: datapoint.target
      });
    }) : normalizedData.edges
  };
  var nodeNotSpatialized = mappedData.nodes.find(function (node) {
    return node.x === undefined && node.y === undefined;
  });
  mappedData.spatialized = nodeNotSpatialized === undefined;
  if (mappedData.spatialized === false) {
    mappedData.nodes = mappedData.nodes.map(function (node) {
      return _extends({}, node, {
        x: Math.cos(idToCoords(node.id)),
        y: Math.sin(-idToCoords(node.id))
      });
    });
  }
  return mappedData;
};