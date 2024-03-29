const express = require('express');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');

const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  jwtValidationMiddleware,
  authController.updatePassword
);

module.exports = router;
