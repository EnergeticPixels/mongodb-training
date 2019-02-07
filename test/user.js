const assert = require('assert');

const User = require('../src/models/user');

require('./test_helper.js');

describe('User Model', () => {

  describe('basic operations', () => {

    let joe;

    beforeEach((done) => {
      joe = new User({ name: 'Joe' });
      joe.save()
        .then(() => done());
    });

    function assertName(operation, done) {
      operation
        .then(() => User.find({}))
        .then((users) => {
          assert(users.length === 1);
          assert(users[0].name === 'Alex');
          done();
        })
    };

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
      // CLASS function - operates one 'User' - returns Object/Doc
      User.findOne({ _id: joe._id })
        .then((user) => {
          assert( user.name === 'Joe');
          done();
        })
    });

    it('model instance Update using set and save user', (done) => {
      // joe
      joe.set( 'name', 'Alex');
      assertName(joe.save(), done);
    });

    it('model instance "joe" update user', (done) => {
      // joe
      assertName(joe.updateOne({ name: 'Alex' }), done);
    });

    it('claas method update user', (done) => {
      // User
      assertName(User.updateMany({ name: 'Joe' }, { name: 'Alex'}), done);
    });

    it('claas method findOneAndUpdate user', (done) => {
      // User
      assertName(User.updateOne({ name: 'Joe' }, { name: 'Alex' }), done);
    });

    it('class method findByIdAndUpdate user', (done) => {
      // User
      assertName(User.updateOne({ _id: joe._id }, { name: 'Alex' }), done);
    });

    it('model instance remove user', (done) => {
      // joe
      joe.remove()
        .then(() => User.findOne({ name: 'Joe'}))
        .then((user) => {
          assert(user === null);
          done();
        })
    });

    it('claas method Remove user', (done) => {
      // User - remove a bunch of records with criteria
      User.deleteMany({ name: 'Joe' })
      .then(() => User.findOne({ name: 'Joe'}))
      .then((user) => {
        assert(user === null);
        done();
      });

    });

    it('claas method findAndRemove user', (done) => {
      // User - remove a particular record
      User.deleteOne({ name: 'Joe' })
      .then(() => User.findOne({ name: 'Joe'}))
      .then((user) => {
        assert(user === null);
        done();
      });
    });

    it('class method findByIdAndRemove user', (done) => {
      // User - remove a particular record
      User.deleteOne({ _id: joe._id })
      .then(() => User.findOne({ name: 'Joe'}))
      .then((user) => {
        assert(user === null);
        done();
      });
    });

  });

  describe('mongo operators', () => {
    
    let joe;

    beforeEach((done) => {
      joe = new User({ name: 'Joe', postCount: 0 });
      joe.save()
        .then(() => done());
    });

    it('a user postCount increments by 1', (done) => {
      User.updateMany({ name: 'Joe' }, { $inc:{ postCount: 1 }})
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
          assert(user.postCount === 1);
          done();
        });
    });


  });

  describe('validation records', () => {
    
    it('requires a username', () => {
      const user = new User({ name: undefined });
      const validationResult = user.validateSync();
      const { message } = validationResult.errors.name;
      assert( message == 'Name is required.' );
    });

    it('name must be longer than two characters', () => {
      const user = new User({ name: 'Al' });
      const validationResult = user.validateSync();
      const { message } = validationResult.errors.name;

      assert( message === 'Name must be longer than 2 characters.');
    });

    it('disallows invalid records to be saved', (done) => {
      const user = new User({ name: 'Al' });
      user.save()
        .catch((validationResult) => {
          const { message } = validationResult.errors.name;
          assert(message === 'Name must be longer than 2 characters.');
          done();
        })
    });
  })

})