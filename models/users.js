//defined mongoose and required it
const mongoose = require('mongoose');

//defined User Schema
const userSchema = new mongoose.Schema({
  username:{
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password:{
    type: String,
    required: true,
    trim: true
  },

  },{ collection: 'MemoryUsers' }
);

module.exports = mongoose.model('MemoryUsers', userSchema);