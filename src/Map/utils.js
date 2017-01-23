/**
 * Recursively finds coordinate couples and reverse them
 * @param {array} coordinates - array of values or arrays representing coordinates
 * @return {array} newArray - the reversed set of coordinates
 */
export const reverseCoordinates = (coordinates) => {
  if (Array.isArray(coordinates)) {
    if (Array.isArray(coordinates[0])) {
      return coordinates.map(reverseCoordinates);
    }
 else {
      return coordinates.reverse();
    }
  }
};
