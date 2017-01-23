'use strict';

var add = require('./mock-fn.js');

describe('add', function () {
  it('should add two numbers', function () {
    expect(add(1, 2)).toBe(3);
  });
});