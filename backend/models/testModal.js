const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['BiharDaroga', 'BPSC', 'Railway', 'UPSC', 'SSC', "others"],
      },
      name:{type:String,required:true},
      start:{type:String,required:true,default:"now"},
      end:{type:String,required:true,default:"now"},
    createdAt: {
        type: Date,
        default: Date.now,
      },  
      updatedAt: Date,
})

const Test = mongoose.model('Test',testSchema );

module.exports = Test;