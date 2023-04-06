const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const jwtValidationMiddleware = require('../../utils/jwtValidationMiddeware');

router.route('/').get(userController.getUsers).post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(jwtValidationMiddleware, userController.patchUser)
  .delete(userController.deleteUser);

module.exports = router;
