const express = require('express');

const app = express();
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');

app.use(express.json());
app.use(express.static(`${process.cwd()}/public`));
app.use(morgan());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
