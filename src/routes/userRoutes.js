const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');
const authorizationMiddleware = require('../../utils/authorizationMiddleware');
const userImageMiddleware = require('../../utils/userImageMiddleware');
const resizeImageMiddleware = require('../../utils/resizeImageMiddleware');

router.use(jwtValidationMiddleware);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authorizationMiddleware('user'),
    userImageMiddleware,
    resizeImageMiddleware,
    userController.patchUser
  )
  .delete(authorizationMiddleware('admin'), userController.deleteUser);

router
  .route('/:id/reviews')
  .post(authorizationMiddleware('user'), reviewController.createReview);

module.exports = router;
