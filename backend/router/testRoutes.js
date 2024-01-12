const express = require('express');
const testController = require('../controllers/testController');
const router = express.Router();

router
  .route('/')
  .get(testController.getAllTests)
  .post(
    // authenticateCors,
    // protect, #donot open only trial mode
    // restrictTo('admin'),
    
    // testController.uploadPhoto,
    // testController.resizePhoto('public/img/news'),

    testController.createOne
  );


module.exports = router;