const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  err.message = message;
  err.statusCode = 400;
};

const handleDuplicatedFieldsError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicated field value ${value}. Please use another value`;
  err.message = message;
  err.statusCode = 400;
};

const handleValidationError = (err) => {
  const message = `Invalid input data`;
  err.message = message;
  err.statusCode = 400;
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error(err);

  let response = {
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      err,
      stack: err.stack,
    }),
  };

  if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      response = {
        status: 500,
        message: 'Sorry, something bad happened!',
      };
    } else {
      if (err.name === 'CastError') handleCastError(err);
      if (err.code === 11000) handleDuplicatedFieldsError(err);
      if (err.name === 'ValidationError') handleValidationError(err);
    }
  }

  res.status(err.statusCode).json(response);
};
