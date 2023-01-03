// models/User.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const ClinicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imgUrl:{
    type:String
  },
  address: {
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
  servicesName:{
    type:String,
    default:'blood test'
  },
  servicePrice:{
    type:Number
  },
  staffs: [
    {
      name: String,
      role: String,
      email: String,
      expertise:String,
    },
  ],

  bookings:[
    {
      patientId:String,
      date:String,
      status:{type:String, default:'pending'},
    }
  ]
});

module.exports = Clinic = mongoose.model("Clinics", ClinicSchema);
