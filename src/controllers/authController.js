const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/AppError');
const sendEmail = require('../../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new AppError('Email and password should be informed', 400);

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    throw new AppError('Incorrect email or password', 401);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError('There is no user with this email address', 422));

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message =
    `Forgot your password? Submit a PATCH request with your new password and passwordConfirm ` +
    `to : ${resetUrl}. If you didn't forget your password, please ignore ths email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token has error or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.createPasswordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
  });
});
