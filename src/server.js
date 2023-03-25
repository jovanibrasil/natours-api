const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = require('./app'); // after the env variables load, because needs values

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

  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
};
