const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError');
const Test = require('../models/testModal');
const User = require('../models/userModal');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = (path) => {
  return catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    const folderName = path.split('/').pop();
    req.file.filename = `${folderName}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      // .resize(1200, 1600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${path}/${req.file.filename}`);
    next();
  });
};

exports.getAllTests = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  // Create a query to retrieve news articles with pagination
  const query = Test.find().skip(skip).limit(limit).sort('-createdAt');
  const query1 = Test.find();
  const tests = await query;
  const test2 = await query1;
  res.status(200).json({
    status: 'success',
    results: tests.length,
    totallength: test2.length,
    data: {
      tests,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const parsedData = JSON.parse(req.body.data);
  let data = parsedData
  
  let photo;
  if (req.file) {
    photo = req.file.filename;
  }
  req.body = { ...req.body, photo ,data };

  // Create the test entry in the database
  const tests = await Test.create(req.body);

  // Respond with the created test entry
  res.status(201).json({
    status: 'success',
    data: {
      tests,
    },
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  let photo;
  if (req.file) {
    photo = req.file.filename;
  }
  req.body = { ...req.body, photo };
  const tests = await Test.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tests) {
    return next(new AppError('No doc found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tests,
    },
  });
});

exports.getTests = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id);
  if (!test) {
    return next(new AppError('No test found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      test,
    },
  });
});

exports.deleteTests = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // console.log("🚀 ~ exports.deleteTests ~ id:", id);
  
  // Attempt to find and delete the test by its ID
  const tests = await Test.findByIdAndDelete(id);
  // console.log("🚀 ~ exports.deleteTests ~ tests:", tests);

  // If the test is not found, return a 404 error
  if (!tests) {
    return next(new AppError('No test found with that ID', 404));
  }

  const imagePath = tests.photo;
  const fullPath = path.join(__dirname, '../public/img/usertest', imagePath);

  // Check if the test has an associated image and delete it from the server's file system if it exists
  if (imagePath && imagePath !== 'uchiudan.png') {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } else {
      return next(new AppError('Photo is not deleted from server', 500));
    }
  }

  // Respond with a success message if the test is successfully deleted
  res.status(200).json({
    status: 'success',
    data: null,
  });
});


exports.userTests = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
      return next(new AppError('No user found with that ID', 404));
  }

  const test_id = req.body.test_id;

  // Check if the user already has a test with the given test_id
  const existingTest = user.test.find(item => item.test_id.toString() === test_id);

  if (existingTest && req.body.isSubmit) {
      // Update the existing user test document
      Object.assign(existingTest, req.body);
      await user.save({ validateBeforeSave: false });
  } else {
      // If the test does not exist or isSubmit is false, create a new user test
      user.test.push(req.body);
      await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
      status: 'success',
      data: {
          user,
      },
  });
});
exports.submitTest = catchAsync(async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return next(new AppError('No test found with that ID', 404));
    }

    // Push the submitted test result into the result array
    test.result.push(req.body);

    // Save the updated test document to the database
    await test.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    // Handle the error appropriately
    console.error('Error submitting test:', error);
    return next(new AppError('An error occurred while submitting the test', 500));
  }
});

