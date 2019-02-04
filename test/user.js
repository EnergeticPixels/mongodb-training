const assert = require('assert');

const User = require('../src/models/user');

require('./test_helper.js');

describe('User Model', () => {

  describe('basic operations', () => {

    let joe;

    beforeEach((done) => {
      joe = new User({ name: 'Joe'});
      joe.save()
        .then(() => done());
    });

    it('should create a user', (done) => {
      assert(!joe.isNew);
      done();
    });

    it('should find all users with name of joe', (done) => {
      // CLASS function - operates one 'User' - returns Array
      User.find({ name: 'Joe'})
        .then((users) => {
          assert( users[0]._id.toString() === joe._id.toString());
          done();
        })
    });

    it('should find one user with name of joe', (done) => {
      
      done();
    });

    it('should update a user', () => {

    });

    it('should remove a user', () => {

    });

  });

})