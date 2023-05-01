const express = require('express');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');

const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get(
  '/checkout-session/:tourId',
  jwtValidationMiddleware,
  bookingController.getCheckoutSession
);

module.exports = router;
