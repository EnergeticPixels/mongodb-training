const assert = require('assert');

const User = require('../src/models/user');
const Comment = require('../src/models/comment');
const BlogPost = require('../src/models/blogPost');

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
      joe = new User({ name: 'Joe', likes: 0 });
      joe.save()
        .then(() => done());
    });

    it('a user postCount increments by 1', (done) => {
      User.updateMany({ name: 'Joe' }, { $inc:{ likes: 1 }})
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
          assert(user.likes === 1);
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
  });

  describe('Subdocuments', () => {

    it('can create a subdocument', (done) => {
      const joe = new User({ name: 'Joe', posts: [{ title: 'PostTitle' }]});
      joe.save()
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
          assert(user.posts[0].title === 'PostTitle');
          done();
        })
    });

    it('can add subdocuments to a existing record', (done) => {
      // whenever you 'push' a information onto a document, you
      // must save the whole document again.
      const joe = new User({ name: 'Joe', posts: []});
      joe.save()
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
          user.posts.push({ title: 'New Post'});
          return user.save();
        })
        .then(() => User.findOne({ name: 'Joe'}))
        .then((user) => {
          assert(user.posts[0].title === 'New Post');
          done();
        });
    });

    it('can remove a subdocument from existing document', (done) => {
      const joe = new User({ name: 'Joe', posts: [{ title: 'New Title'}]});
      joe.save()
        .then(() => User.findOne({ name: 'Joe'}))
        .then((user) => {
          user.posts[0].remove();
          return user.save();
        })
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
          assert(user.posts.length === 0)
          done();
        });
    });
  });

  describe('Virtual types', () => {

    it('postCount returns number of posts', (done) => {
      const joe = new User({ name: 'Joe', posts: [{ title: 'New Title'}]});
      joe.save()
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
          assert(joe.postCount === 1);
          done();
        })
    });
  });

  describe('Associations', () => {
    // init'ing model instance of each collection
    let joe, blogPost, comment;

    beforeEach((done) => {
      // nothing below indicates that 'joe' owns the 'blogpost' or a 'comment'
      joe = new User({ name: 'Joe' });
      blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
      comment = new Comment({ content: 'Congrats on great post' });

      // this is where we associate blogpost with joe then save.
      // these two below are arrays.  Notice the plural words.
      joe.blogPosts.push(blogPost);
      blogPost.comments.push(comment);
      // below is a one to one relationship
      comment.user = joe;

      // this is how we chain each 3 saves to make sure they all get saved before
      // calling a 'then()' return
      Promise.all([ joe.save(), blogPost.save(), comment.save() ])
        .then(() => done());
    });

    it('saves a relation between a user and a blogpost', (done) => {

      User.findOne({ name: 'Joe' })
        // idea of using 'query' method of mongodb
        // mongoose does not allow you to recursively crawl from user to all blogposts and
        // comments because it could take an ungodly amount of time to return the data.
        // must explictly do each populate.
        .populate('blogPosts')
        .then((user) => {
          // console.info(user);
          // console.info(user.blogPosts[0]);
          // console.info();
          assert(user.blogPosts[0].title === 'JS is Great')
          done();
        })
    });

    it('saves a full relatation graph', (done) => {
      User.findOne({ name: 'Joe'})
        .populate({
          // first get me all blogposts associated with 'Joe'
          path: 'blogPosts',
          model: 'blogPost',
          // then within the returned blogPosts get me all the comments
          // joe has made
          populate: {
            path: 'comments',
            model: 'comment',
            populate: {
              path: 'user',
              model: 'user'
            }
          }
        })
        .then((user) => {
          //console.info(user.blogPosts[0].comments[0].user.name)
          assert(user.name === 'Joe');
          assert(user.blogPosts[0].title === 'JS is Great');
          assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
          assert(user.blogPosts[0].comments[0].user.name === 'Joe');
          done();
        })
    });
  });

  describe('Middleware', () => {

    let joe, blogPost;

    beforeEach((done) => {
      // nothing below indicates that 'joe' owns the 'blogpost' or a 'comment'
      joe = new User({ name: 'Joe' });
      blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
      
      // this is where we associate blogpost with joe then save.
      // these two below are arrays.  Notice the plural words.
      joe.blogPosts.push(blogPost);

      // this is how we chain each 2 saves to make sure they all get saved before
      // calling a 'then()' return
      Promise.all([ joe.save(), blogPost.save() ])
        .then(() => done());
    });

    it('users cleanup dangling blogPosts on remove', (done) => {

      joe.remove()
        .then(() => BlogPost.countDocuments())
        .then((result) => {
          assert(result === 0);
          done();
        });
    });
  });

})