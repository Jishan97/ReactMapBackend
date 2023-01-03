// models/User.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const ReportSchema = new Schema({
  title: {
    type: String,
  },
  patientId: {
    type: String,
    required: true,
  },
  ClinicId: {
    type: String,
    required: true,
  },
  staffId: {
    type: String,
    required: true,
  },

  staffName: {
    type: String,
    required: true,
  },
  
  detailedReport: {
    hemoglobin: Number,
    rbc: Number,
    mcu: Number,
    plt: Number,
  },
  critical: {
    type: Boolean,
    required: true,
    default:false
  },

  alert: {
    type: Boolean,
    required: true,
    default:false
  },
});

module.exports = Report = mongoose.model("Reports", ReportSchema);
