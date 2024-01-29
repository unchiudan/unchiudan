const express = require('express');
const testController = require('../controllers/testController');
// const authController = require('../controllers/authController.js');
const router = express.Router();
const {
  protect,
  restrictTo,
  authenticateCors,
} = require('../controllers/authController');
router.route('/').get(testController.getAllTests).post(
  // authenticateCors,
  // protect, #donot open only trial mode
  // restrictTo('admin'),

  testController.uploadPhoto,
  testController.resizePhoto('public/img/test'),

  testController.createOne,
);

router
  .route('/:id')
  .get(testController.getTests)
  .delete(authenticateCors, restrictTo('admin'), testController.deleteTests)
  .patch(
    authenticateCors,
    restrictTo('admin'),
    testController.uploadPhoto,
    testController.resizePhoto('public/img/test'),
    testController.updateOne,
  );

//   router
//   .route('/autodelete')
//   .delete(authenticateCors, restrictTo('admin'), newsController.autoDelete);

router
  .route('/user/:id')
  .patch( testController.userTests);

module.exports = router;
