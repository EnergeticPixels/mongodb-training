const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect("mongodb://127.0.0.1/user_test", {useNewUrlParser: true});
  mongoose.connection
    .once('open', () => { done(); })
    .on('error', (error) => {
      console.warn('Warning', error)
    });
})


beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;
  // Mongo and Mongoose will not let you drop multiple collections simultaneously.  So we have to do this
  // 'callback of doom' thing.
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      })
    })
  });
});