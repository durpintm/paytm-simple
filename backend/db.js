const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/PaytmDB";

mongoose.connect(uri);

const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 25,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;
