const { time } = require('console');
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  test: {
    type: mongoose.Schema.ObjectId,
    ref: 'Test',
    required: true,
  },
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
