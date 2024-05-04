const mongoose = require('mongoose');



const dailytestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

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
});

const DailyTest = mongoose.model('DailyTest', dailytestSchema);

module.exports = DailyTest;