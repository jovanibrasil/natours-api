const Tour = require('../models/tourModel');
const APIFeatures = require('../../utils/apiFeatures');

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
      status: 'fail',
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
      status: 'fail',
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
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
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
      status: 'fail',
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      // group using accumulators
      {
        $group: {
          //_id: null, // is null because I have one group only
          _id: '$difficulty',
          // define new fields and how they will be calculated
          numTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          numRatings: { $sum: '$ratingsQuantity' },
        },
      },
      {
        $sort: {
          avgPrice: 1,
        },
      },
      {
        $match: { _id: { $ne: 'easy' } },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        tour: stats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        // deconstructs the tour array, create a tour by each date from startDates
        $unwind: '$startDates',
      },
      {
        // select tours that happens in the informed year
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          __id: 0,
        },
      },
      {
        $sort: {
          numToursStarts: -1,
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        tour: plan,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: error,
    });
  }
};
