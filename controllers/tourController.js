// const fs = require('fs');
const Tour = require('../models/tourModel');
// const { v4: uuidv4 } = require('uuid');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkSomething = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   // do something
//   next();
// };

// exports.checkbody = (req, res, next) => {
//   let body = req.body;
//   if (!body.name || !body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTours = async (req, res) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  //const tours = await Tour.find(queryObj);
  // FILTERING
  // the received query do not contain the $ notation
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // { difficulty: 'easy', duration: { $gte: 5 } }

  let query = Tour.find(JSON.parse(queryStr));

  // SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    //query = query.sort(req.query.sort);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // LIMIT FIELDS
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields); // "projeting" is the name of this operation
  } else {
    query = query.select('-__v');
  }

  // PAGINATION
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  //?page=2&limit=5   page1 -> 1-5 page2 -> 6-10
  //query = query.skip(5).limit(10);
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numTours = await Tour.countDocuments();
    if (skip > numTours) throw new Error('This page does not exist');
  }

  const tours = await query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.getTour = async (req, res) => {
  //const tour = tours.find((el) => req.params.id === el.id);
  //const tour = Tour.findById({ id: req.params.id });
  const tour = await Tour.findOne({ _id: req.params.id });
  if (!tour) {
    return res.status(404).json({
      status: 'not-found',
      message: 'resource not found',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.patchTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Sothing bad happened!',
    });
  }
};

exports.deleteTour = (req, res) => {
  try {
    Tour.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Sothing bad happened!',
    });
  }
};

exports.createTour = async (req, res) => {
  //let toudId = uuidv4();
  //const newTour = Object.assign({ id: toudId }, req.body);
  //tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Sothing bad happened!',
    });
  }
};
