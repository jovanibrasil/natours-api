const express = require('express');

const app = express();
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandlerMiddleware = require('../utils/errorHandleMiddleware');
const AppError = require('../utils/AppError');

app.use(express.json());
app.use(express.static(`${process.cwd()}/public`));
app.use(morgan());

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
