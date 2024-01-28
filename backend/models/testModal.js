const { time } = require('console');
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({

  name: { type: String, required: true },
  mainstart: { type: String, required: true },
  mainend: { type: String, required: true },
  photo: {
    type: String,
    default: 'uchiudan.png',
  },
  data: [
    {
      ques: String,
      options: [
        {
          type: String,
          trim: true,
        },
      ],
      ans: {
        type: String,
        trim: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
  correctmarks:{type:Number},
  negativemarks:{type:Number},
  testtime:{type:Number}
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
