const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = require('./post');

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: 'Name must be longer than 2 characters.'
    },
    required: [true, 'Name is required.']
  },
  likes: Number,
  posts: [PostSchema],
  blogPosts: [{ 
    type: Schema.Types.ObjectId,
    ref: 'blogPost'
  }]
});

// must use the old method of function() { in this instance and NOT
// fat arrow.  if used fat arrow, 'this' would have referenced whole file.
// going old school, keeps 'this' keyword local referencing the schema which
// references the model.
UserSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

const User = mongoose.model('user', UserSchema);

module.exports = User;