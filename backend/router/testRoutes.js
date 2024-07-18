const express = require('express');
const testController = require('../controllers/testController');
const {
  protect,
  restrictTo,
  authenticateCors,
} = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(testController.getAllTests)
  .post(
    authenticateCors,
    restrictTo('admin'),
    testController.uploadPhoto,
    testController.resizePhoto('public/img/usertest'),
    testController.createOne,
  );

router
  .route('/:id')
  .get(testController.getTests)
  .delete(authenticateCors, restrictTo('admin'), testController.deleteTests)
  .patch(
    // authenticateCors,
    // restrictTo('admin'),
    testController.uploadPhoto,
    testController.resizePhoto('public/img/usertest'),
    testController.updateOne,
  );

//   router
//   .route('/autodelete')
//   .delete(authenticateCors, restrictTo('admin'), newsController.autoDelete);

router.route('/user/:id').patch(testController.userTests);

router.route('/submit/:id').patch(testController.submitTest); //testid

// router
//   .route('/showanswer/:id')
//   .patch(
//     authenticateCors,
//     restrictTo('admin'),
//     testController.uploadPhoto,
//     testController.resizePhoto('public/img/test'),
//     testController.updateOne,
//   );

module.exports = router;
