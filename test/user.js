const assert = require('assert');

const User = require('../src/models/user');

require('./test_helper.js');

describe('basic user ops', () => {

  describe.only('create', () => {

    it('should create a user', (done) => {
      const joe = new User({ name: 'Joe' });
      joe.save()
        .then(() => {
          assert(!joe.isNew);
          done();
        })
    });
  });

  describe('read', () => {

  });

  describe('update', () => {

  });

  describe('delete', () => {

  })
})