const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const User = require('../models/userModel');

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById({ _id: req.params.id });

  if (!user) throw new AppError('No user found with that ID', 404);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isDeleted: true });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.patchUser = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, name } = req.body;

  if (password || passwordConfirm)
    return next(new AppError('This route is not for password updates.', 400));

  const updateUser = { name };

  if (req.files) updateUser.photo = req.files.photo.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateUser, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
