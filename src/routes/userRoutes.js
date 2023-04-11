const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');
const authorizationMiddleware = require('../../utils/authorizationMiddleware');

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    jwtValidationMiddleware,
    authorizationMiddleware('user'),
    userController.patchUser
  )
  .delete(
    jwtValidationMiddleware,
    authorizationMiddleware('admin'),
    userController.deleteUser
  );

router
  .route('/:id/reviews')
  .post(
    jwtValidationMiddleware,
    authorizationMiddleware('user'),
    reviewController.createReview
  );

module.exports = router;
