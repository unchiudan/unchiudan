const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mainstart: { type: Number, required: true },
  mainend: { type: Number, required: true },
  photo: {
    type: String,
    default: 'uchiudan.png',
  },
  data: [
    {
      ques: String,
      options: [{ type: String, trim: true }],
      ans: { type: String, trim: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  correctmarks: { type: Number },
  negativemarks: { type: Number },
  testtime: { type: Number },
  result: [{
    userid: { type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true },
    username: { type: String },
    useremail: { type: String },
    // userstart: { type: Date },
    // userstop: { type: Number },
    userphone: { type: String },
    correct: { type: Number },
    submittime: { type: Number },
    score: { type: Number },
    notattempt: { type: Number },
    totalQuestions: { type: Number },
    negativemarks: { type: Number },
    district: { type: String },
    percentage: { type: Number },
    isSubmit: { type: Boolean }
  }]
});

// Pre-save hook to initialize result field if not provided
testSchema.pre('save', function (next) {
  if (!this.result || this.result.length === 0) {
    this.result = []; // Initialize result to an empty array
  }
  next();
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
