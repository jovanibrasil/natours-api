const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');
const reviewRoutes = require('./reviewRoutes');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');
const authorizationMiddleware = require('../../utils/authorizationMiddleware');
const imageUploadMiddleware = require('../../utils/imageUploadMiddleware')({
  fields: [
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
  ],
});
const resizeImageMiddleware = require('../../utils/resizeImageMiddleware')({
  fields: [
    {
      name: 'imageCover',
      filenameFunction: (req) =>
        `tour-${req.params.id}-${Date.now()}-cover.jpg`,
      size: { windth: 2000, height: 1333 },
      filepath: 'public/img/tours',
    },
    {
      name: 'images',
      filenameFunction: (req) => `tour-${req.params.id}-${Date.now()}-.jpg`,
      size: { windth: 2000, height: 1333 },
      filepath: 'public/img/tours',
    },
  ],
});

router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getTours)
  .post(
    jwtValidationMiddleware,
    imageUploadMiddleware,
    resizeImageMiddleware,
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    jwtValidationMiddleware,
    imageUploadMiddleware,
    resizeImageMiddleware,
    tourController.patchTour
  )
  .delete(
    jwtValidationMiddleware,
    authorizationMiddleware('admin'),
    tourController.deleteTour
  );

module.exports = router;
