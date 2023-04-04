const AppError = require('./AppError');

module.exports = (req, res, next) => {
  let token;

  if (req.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    throw new AppError('You are not logged in, please log in to get acccess!', 401);

  next();
};
