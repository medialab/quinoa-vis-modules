'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = mapData;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


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

function mapData() {
  var normalizedData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { nodes: [], edges: [] };
  var dataMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { nodes: [], edges: [] };

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
}

