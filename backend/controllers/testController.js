const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Test = require('../models/testModal');

exports.getAllTests = catchAsync(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    // Create a query to retrieve news articles with pagination
    const query = Test.find().skip(skip).limit(limit).sort("-updatedAt");
    const query1 = Test.find();
    const tests = await query;
    const test2 = await query1;
    res.status(200).json({
      status: 'success',
      results: tests.length,
      totallength:test2.length,
      data: {
        tests,
      },
    });
  });

  exports.createOne = catchAsync(async (req, res, next) => {
 
  
    const currentDate = Date.now();
   
    req.body = { ...req.body,updatedAt: currentDate };
    const tests = await Test.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        tests,
      },
    });
  });