// routes/api/users.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load User model
const User = require("../models/User");
const Clinic = require("../models/Clinic");
const Report = require("../models/Report");

// @route POST api/clinic/addClinic
// @desc Add clinic to the database
// @access Private
router.post(
  "/addClinic",
  //   passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      // if(req.user.level === 1) {

      const newClinic = new Clinic({
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        address: req.body.address,
        postcode: req.body.postcode,
        servicePrice:req.body.servicePrice,
        lat: req.body.lat,
        lng: req.body.lng,
  
      });

      newClinic
        .save()
        .then((user) => res.json(user))
        .catch((err) => console.log(err));

      // } else {
      // return res.status(400).json({msg:"Unauthorized"});

      // }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "something went wrong" });
    }
  }
);

// @route GET api/clinic/allClinic
// @desc Retrive all clinics from database
// @access Private
router.get(
  "/allClinic",
  //   passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // if(req.user.level === 1) {
      const data = await Clinic.find({});
      res.json(data);
      // } else {
      // return res.status(400).json({msg:"Unauthorized"});

      // }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "something went wrong" });
    }
  }
);

// @route PUT api/clinic/updateService
// @desc Add or update service
// @access Private
router.put(
  "/addStaff/:id",
  //   passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // if(req.user.level === 1) {

      const data = await Clinic.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            staffs: {
              name: req.body.name,
              role: req.body.role,
              email: req.body.email,
              expertise: req.body.expertise,
            },
          },
        },{
          new: true
        }
      );
      res.json(data);
      // } else {
      // return res.status(400).json({msg:"Unauthorized"});

      // }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "something went wrong" });
    }
  }
);



// @route PUT api/clinic/generateBooking
// @desc generate booking
// @access Private
router.post(
  "/generateBooking",
  //   passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // if(req.user.level === 1) {

      const report = new Report({
        title: req.body.title,
        patientId: req.body.patientId,
        ClinicId: req.body.ClinicId,
        staffId: req.body.staffId,
        staffName:req.body.staffName,
        detailedReport:{
          hemoglobin:req.body.hemoglobin,
          rbc:req.body.rbc,
          mcu:req.body.mcu,
          plt:req.body.plt,
        },
        critical:req.body.critical,
        alert:req.body.alert
      });

      report
      .save()
      .then((user) => res.json(user))
      .catch((err) => console.log(err));


      // } else {
      // return res.status(400).json({msg:"Unauthorized"});

      // }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ msg: "something went wrong" });
    }
  }
);














module.exports = router;
