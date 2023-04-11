const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');
const reviewRoutes = require('./reviewRoutes');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');
const authorizationMiddleware = require('../../utils/authorizationMiddleware');

router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getTours)
  .post(jwtValidationMiddleware, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(jwtValidationMiddleware, tourController.patchTour)
  .delete(
    jwtValidationMiddleware,
    authorizationMiddleware('admin'),
    tourController.deleteTour
  );

module.exports = router;
