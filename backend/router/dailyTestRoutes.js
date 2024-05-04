const express = require('express');
const dailyTestController = require('../controllers/dailyTestController');
const { protect, restrictTo,authenticateCors} = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(dailyTestController.getAllDailyTests)
  .post(
    authenticateCors,
    // protect,
    restrictTo('admin'),
    dailyTestController.uploadPhoto,
    dailyTestController.resizePhoto('public/img/dailytests'),
    dailyTestController.createOne,
  );

router
  .route('/:id')
  .get(dailyTestController.getTests)
  .delete(authenticateCors, restrictTo('admin'), dailyTestController.deleteTests)
  .patch(
    authenticateCors,
    restrictTo('admin'),
    dailyTestController.uploadPhoto,
    dailyTestController.resizePhoto('public/img/dailytests'),
    dailyTestController.updateOne,
  );

module.exports = router;
