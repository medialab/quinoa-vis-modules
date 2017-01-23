import {
  reverseCoordinates,
  flattenGeoJSON,
  mapData,
  computeDataRelatedState
} from '../src/utils/mapDataParser';

describe('Map utils', () => {

  describe('reverseCoordinates', () => {
    it('should be a function', () => {
      expect(typeof reverseCoordinates).toBe('function');
    });

    it('should return an array, given an array argument', () => {
      expect(Array.isArray(reverseCoordinates([]))).toBe(true);
    });

    it('should reverse coordinates', () => {
      const reversed = JSON.stringify(reverseCoordinates([1, 2]));
      const expected = JSON.stringify([2, 1]);
      expect(reversed).toBe(expected);
    });

    it('should reverse recursively', () => {
      const reversed = JSON.stringify(reverseCoordinates([[1, 2], [3, 4]]));
      const expected = JSON.stringify([[2, 1], [4, 3]]);
      expect(reversed).toBe(expected);
    });
  });

});
