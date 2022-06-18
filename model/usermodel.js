const mongoose = require("mongoose");

const findOrCreate = require('mongoose-findorcreate');
const passportLocalMoongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});


/*using session on userSChema using plugin*/
userSchema.plugin(passportLocalMoongoose);

/*for findorcreate google auh*/

userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);


module.exports = User;
