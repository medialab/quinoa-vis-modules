import {expect} from 'chai';

import model from './model';

describe('Timeline visualization model', () => {

  it('should present a data map prop', (done) => {
    expect(model).to.have.property('dataMap');
    done();
  });

  it('should present datamap objects with id and an array of accepted values types', (done) => {
    model.dataMap.forEach(prop => {
      expect(prop).to.have.property('id');
      expect(prop.id).to.be.a('string');
      expect(prop).to.have.property('acceptedValueTypes');
      expect(prop.acceptedValueTypes).to.be.an('array');
    });
    done();
  });

  it('should have view parameters', (done) => {
    expect(model).to.have.property('viewParameters');
    done();
  });
});
