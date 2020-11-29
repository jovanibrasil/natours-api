const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

dotenv.config({
  path: './config.env',
});

const DB_CONNECTION_STRING = process.env.DATA_BASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  //.connect(process.env.DATA_BASE_LOCAL, {
  .connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connected succesffully');
  });

const importData = async () => {
  try {
    const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');
    await Tour.create(JSON.parse(tours));
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv.includes('--import')) importData();
if (process.argv.includes('--delete')) deleteData();

console.log(process.argv);
