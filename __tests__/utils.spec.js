import {
  reverseCoordinates,
  flattenGeoJSON,
  mapData,
  computeDataRelatedState
} from '../src/utils/mapDataParser';

describe('mapDataParser', () => {

  const fixture = (type) => {
    return () => {
      return {
        'type': type,
        'properties': {'prop0': 'value0', 'prop1': {'this': 'that'}},
        '_storage_options': 'foo',
        'features': [
          {
            'type': 'Feature',
            'geometry': {'type': 'LineString', 'coordinates': [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]},
            'properties': {'prop0': 'value0', 'prop1': 0.0}
          },
          {
            'type': 'Feature',
            'geometry': {'type': 'LineString', 'coordinates': [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]},
            'properties': {'prop0': 'value0', 'prop1': 0.0}
          }
        ]
      }
    }
  };

  describe('#reverseCoordinates', () => {
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

  describe('#flattenGeoJSON', () => {
    it('should be a function', () => {
      expect(typeof flattenGeoJSON).toBe('function');
    });

    it('should return an empty array if "FeatureCollection" field is missing in object', () => {
      const foo = fixture('WrongType')();

      expect(JSON.stringify(flattenGeoJSON(foo))).toBe('[]');
    });

    it('should return an empty array if a `features` array property is missing in object', () => {
      const foo = fixture('FeatureCollection')();
      foo.features = {};

      expect(JSON.stringify(flattenGeoJSON(foo))).toBe('[]');
    });

    it('should flatten geoJSON object to an one-dimensional array', () => {
      const foo = fixture('FeatureCollection')();
      const result = flattenGeoJSON(foo);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(typeof result[0]).toBe('object');
      expect(typeof result[1]).toBe('object');
    });

    it('should remove `_storage_options` field from the results', () => {
      const foo = fixture('FeatureCollection')();
      const result = flattenGeoJSON(foo);

      expect(result[0].hasOwnProperty('_storage_options')).toBe(false);
    });

    it('should reverse coordinates in results', () => {
      const foo = fixture('FeatureCollection')();
      const coords = JSON.stringify(flattenGeoJSON(foo)[0].geometry.coordinates);

      expect(coords).toBe(JSON.stringify([[0.0, 102.0], [1.0, 103.0], [0.0, 104.0], [1.0, 105.0]]));
    });
  });

});
