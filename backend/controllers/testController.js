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
  const query = Test.find().skip(skip).limit(limit).sort('-updatedAt');
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
  let photo;
  if (req.file) {
    photo = req.file.filename;
  }

  const currentDate = Date.now();

  req.body = { ...req.body, photo, updatedAt: currentDate };
  const tests = await Test.create(req.body);

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
  const tests = await Test.findByIdAndRemove(req.params.id);

  if (!tests) {
    return next(new AppError('No test found with that ID', 404));
  }

  const imagePath = tests.photo;

  const fullPath = path.join(__dirname, '../public/img/test', imagePath);
  if (imagePath && imagePath !== 'uchiudan.png') {
    if (fs.existsSync(fullPath)) {
      // Delete the image file from the server's file system
      fs.unlinkSync(fullPath);
    } else {
      return new AppError('Photo is not deleted from server', 500);
    }
  }

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
  // console.log("🚀 ~ exports.userTests=catchAsync ~ test_id:", test_id)

  const usertest = user.test.some(item => item.test_id.toString() === test_id);
  // console.log(usertest,"😍😍😍😍")
  if (!usertest) {
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
