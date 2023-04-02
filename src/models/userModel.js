const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, provide your confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  this.password = bcrypt.hashSync(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compareSync(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
