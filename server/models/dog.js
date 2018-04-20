const mongoose = require('mongoose');
const dogSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  picture:{
    type:String,
    required:false
  },
  description:{
    type:String,
    required:false
  },
  personality:{
    type:String,
    required:false
  }
})

const Dog = mongoose.model('Dog', dogSchema);

module.exports = {Dog};
