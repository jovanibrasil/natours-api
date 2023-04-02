const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    validator: [
      validator.isEmail,
      'Please, provide an email with valid format',
    ],
    unique: [true, 'Already already exists user with this email'],
    lowercase: true,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please, provide your password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, provide your confirm password'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
