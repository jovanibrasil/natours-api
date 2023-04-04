const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('./AppError');
const User = require('../src/models/userModel')

module.exports = async (req, res, next) => {
  let token;

  if (req.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(new AppError('You are not logged in, please log in to get acccess!', 401, false));

  let decodedToken;
  try {
    decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production')
      return next(error);

    if (error.name === 'ValidationError')
      return next(new AppError('Invalid token, please login again!', 401, false));

    if (error.name === 'JsonWebTokenError')
      return next(new AppError('Your token has expired, please login again!', 401, false));

  }

  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser)
    return next(new AppError('The user belonging to this token does not longer exist!', 401, false));

  if (currentUser.changedPasswordAfter(decodedToken.iat))
    return next(new AppError('The user changed the password, please login again!', 401, false));

  req.use = currentUser;
  next();
};
