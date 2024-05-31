const { Schema, model } = require("mongoose");

const uri = "mongodb://localhost:27017/PaytmDB";

mongoose.connect(uri);

const UserSchema = Schema({
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

const AccountSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

const Users = model("Users", UserSchema);
const Accounts = model("Accounts", AccountSchema);

module.exports = { Users, Accounts };
