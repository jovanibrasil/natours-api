// const fs = require('fs');
const Tour = require('../models/tourModel');
// const { v4: uuidv4 } = require('uuid');
const APIFeatures = require('../utils/apiFeatures');

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
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Something bad happened!',
    });
  }
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
      message: 'Something bad happened!',
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
