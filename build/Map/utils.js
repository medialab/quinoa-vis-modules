"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var reverseCoordinates = exports.reverseCoordinates = function reverseCoordinates(coordinates) {
  if (Array.isArray(coordinates)) {
    if (Array.isArray(coordinates[0])) {
      return coordinates.map(reverseCoordinates);
    } else {
      return coordinates.reverse();
    }
  }
};