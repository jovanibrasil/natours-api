module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error(err);

  let response = {
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { err, stack: err.stack }),
  };

  if (err.isOperational && process.env.NODE_ENV === 'production')
    response = {
      status: 500,
      message: 'Sorry, something bad happened!',
    };

  res.status(err.statusCode).json(response);
};
