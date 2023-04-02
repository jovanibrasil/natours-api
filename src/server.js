const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err.name, err.message);
  process.exit(1);
});

dotenv.config();
const app = require('./app');
// after the env variables load, because needs values
module.exports = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then((con) => {
      console.log('DB connected succesffully');
    });

  const port = process.env.PORT || 3000;

  const server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('unhandledRejection', err.name, err.message);
    server.close(() => {
      console.log('Server closed!');
      process.exit(1);
    });
  });
};
