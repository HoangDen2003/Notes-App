const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  googleId: {
    type: String,
    require: true,
  },
  displayId: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  profileImage: {
    type: String,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
