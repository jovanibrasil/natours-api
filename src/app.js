const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandlerMiddleware = require('../utils/errorHandleMiddleware');
const AppError = require('../utils/AppError');

const limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP, please try again in an hour',
});

app.use(helmet());
app.use('/api', limiter);

app.use(morgan());

app.use(
  express.json({
    limit: '10kb',
  })
);
app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(express.static(`${process.cwd()}/public`));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/auth', authRoutes);

app.all('*', (req, res, next) => {
  throw new AppError(
    new Error(`Can't find ${req.originalUrl} on this server!`),
    404
  );
});

app.use(errorHandlerMiddleware);

module.exports = app;
