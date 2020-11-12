let mongoose = require('mongoose');

//object schema
let objectSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
});

let Object = module.exports = mongoose.model('Object', objectSchema);
