const fs = require('fs');
const path = require('path');
const DailyTest = require('../models/dailyttest');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
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





exports.getAllDailyTests = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    // Create a query to retrieve news articles with pagination
    const query = DailyTest.find().skip(skip).limit(limit).sort("-updatedAt");
    const query1 = DailyTest.find();
    const dailytest = await query;
    const dailytest2 = await query1;
    res.status(200).json({
      status: 'success',
      results: dailytest.length,
      totallength:dailytest2.length,
      data: {
        dailytest,
      },
    });
  });


  exports.getTests = catchAsync(async (req, res, next) => {
    const dailytest = await DailyTest.findById(req.params.id);
    if (!dailytest) {
      return next(new AppError('No dailytest found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        dailytest,
      },
    });
  });


  exports.deleteTests = catchAsync(async (req, res, next) => {
    const dailytest = await DailyTest.findByIdAndDelete(req.params.id);
  
    if (!dailytest) {
      return next(new AppError('No dailytest found with that ID', 404));
    }
  
    const imagePath = dailytest.photo;
  
    const fullPath = path.join(__dirname, '../public/img/dailytests', imagePath);
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


  exports.updateOne = catchAsync(async (req, res, next) => {
    const parsedData = JSON.parse(req.body.data);
     let data = parsedData
     console.log("🚀 ~ exports.updateOne=catchAsync ~ data:", data)
    let photo;
    if (req.file) {
      photo = req.file.filename;
    }
    req.body = { ...req.body, photo,data };
    const dailytest = await DailyTest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    if (!dailytest) {
      return next(new AppError('No doc found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        dailytest,
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
  
    const currentDate = Date.now();
   
    req.body = { ...req.body, photo,updatedAt: currentDate,data };
    const dailytest = await DailyTest.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        dailytest,
      },
    });
  });