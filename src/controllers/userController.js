const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const User = require('../models/userModel');

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!',
  });
};

exports.patchUser = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, name } = req.body;

  if (password || passwordConfirm)
    return next(new AppError('This route is not for password updates.', 400));
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
