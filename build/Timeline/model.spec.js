'use strict';

var _chai = require('chai');

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Timeline visualization model', function () {

  it('should present a data map prop', function (done) {
    (0, _chai.expect)(_model2.default).to.have.property('dataMap');
    done();
  });

  it('should present datamap objects with id and an array of accepted values types', function (done) {
    _model2.default.dataMap.forEach(function (prop) {
      (0, _chai.expect)(prop).to.have.property('id');
      (0, _chai.expect)(prop.id).to.be.a('string');
      (0, _chai.expect)(prop).to.have.property('acceptedValueTypes');
      (0, _chai.expect)(prop.acceptedValueTypes).to.be.an('array');
    });
    done();
  });

  it('should have view parameters', function (done) {
    (0, _chai.expect)(_model2.default).to.have.property('viewParameters');
    done();
  });
});