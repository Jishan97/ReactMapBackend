// models/User.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  level:{
    type:String,
    default:1
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },

  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  bookings:[
    {
      clinicId:String,
      staffId:String,
      date:String,
      status:{type:String, default:'pending'},
    }
  ]
});

module.exports = User = mongoose.model("users", UserSchema);
