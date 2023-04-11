const express = require('express');

const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');
const authorizationMiddleware = require('../../utils/authorizationMiddleware');

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    jwtValidationMiddleware,
    authorizationMiddleware('user'),
    reviewController.createReview
  );

module.exports = router;
