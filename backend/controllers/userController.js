const User = require('../models/userModal');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // console.log("🚀 ~ exports.getMe=catchAsync ~ user:", user)

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndRemove(req.user.id);
  res.status(204).json({ status: 'success', data: null });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const filterObj = (obj, ...allowedfeilds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedfeilds.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email', 'phone');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
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

exports.deleteUserTest = catchAsync(async (req, res, next) => {
  try {
    // Extract userId and testId from the request parameters
    const { userId, testId } = req.params;
    console.log("🚀 ~ exports.deleteUserTest ~ testId:", testId)
    
    // Assuming you have a User model
    const user = await User.findById(userId);
    
    // Find the index of the test object to delete
    const testIndex = user.test.findIndex(test => test._id.toString() === testId);
    console.log(testIndex,"😀😀😀😀")

    // If the test object exists, remove it from the array
    if (testIndex !== -1) {
        user.test.splice(testIndex, 1);
        await user.save();
        return res.status(200).json({ message: 'Test object deleted successfully' });
    } else {
        return res.status(404).json({ message: 'Test object not found' });
    }
} catch (error) {
    console.error('Error deleting test object:', error);
    return res.status(500).json({ message: 'Internal server error' });
}
})