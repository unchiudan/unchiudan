const express = require('express');
const pdfController = require('../controllers/pdfContoller');
const { protect, restrictTo,authenticateCors } = require('../controllers/authController');

const router = express.Router();




module.exports = router;
