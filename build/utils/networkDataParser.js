'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; 


exports.default = parseData;

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

function parseData() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var dataFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'gexf';

  var normalizedData = {
    edges: [],
    nodes: []
  };
  if (dataFormat === 'gexf') {
    (function () {
      var domised = new DOMParser().parseFromString(str, 'application/xml');
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
  } else if (dataFormat === 'json') {
    try {
      var data = JSON.parse(str);
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
    } catch (e) {
      return undefined;
    }
  } else if (dataFormat === 'graphml') {
    normalizedData = parseGraphML(str);
  } else {
  }
  return normalizedData;
}