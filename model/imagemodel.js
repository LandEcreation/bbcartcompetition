const mongoose = require("mongoose");



// Step 6 - load the mongoose model for Image

const imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  fullname: String,
  email: String,
  number: String,
  img: {
    data: Buffer,
    contentType: String
  }
});


module.exports = new mongoose.model('Image', imageSchema);
