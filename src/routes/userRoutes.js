const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');
const authorizationMiddleware = require('../../utils/authorizationMiddleware');
const imageUploadMiddleware = require('../../utils/imageUploadMiddleware');
const resizeImageMiddleware = require('../../utils/resizeImageMiddleware');

const filenameFunction = (req) => `user-${req.user.id}-${Date.now()}.jpg`;

router.use(jwtValidationMiddleware);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(
    authorizationMiddleware('user'),
    imageUploadMiddleware({ fields: [{ name: 'photo', maxCount: 1 }] }),
    resizeImageMiddleware({
      fields: [
        {
          name: 'photo',
          filenameFunction,
          size: { windth: 500, height: 500 },
          filepath: 'public/img/users',
        },
      ],
    }),
    userController.patchUser
  )
  .delete(authorizationMiddleware('admin'), userController.deleteUser);

router
  .route('/:id/reviews')
  .post(authorizationMiddleware('user'), reviewController.createReview);

module.exports = router;
