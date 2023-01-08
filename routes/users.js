// routes/api/users.js

const express = require('express');
const app = express();

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

// Load User model
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Report = require('../models/Report');


// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        postcode:req.body.postcode,
        lat: req.body.lat,
        lng: req.body.lng,
      });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => res.status(500).send({ error: 'Something failed!' }));
                });
              });
            }
          });
        });
        
        // @route POST api/users/login
        // @desc Login user and return JWT token
        // @access Public
        router.post('/login', (req, res) => {
          // Form validation
          const { errors, isValid } = validateLoginInput(req.body);
        
          // Check validation
          if (!isValid) {
            return res.status(400).json(errors);
          }
        
          const email = req.body.email;
          const password = req.body.password;
        
          // Find user by email
          User.findOne({ email }).then(user => {
            // Check if user exists
            if (!user) {
              return res.status(404).json({ emailnotfound: 'Email not found' });
            }
        
            // Check password
            bcrypt.compare(password, user.password).then(isMatch => {
              if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                  id: user.id,
                  name: user.name
                };
        
                // Sign token
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  {
                    expiresIn: 31556926 // 1 year in seconds
                  },
                  (err, token) => {
                    res.json({
                      success: true,
                      token: 'Bearer ' + token,
                      allDetails:user
                    });
                  }
                );
              } else {
                return res
                  .status(400)
                  .json({ passwordincorrect: 'Password incorrect' });
              }
            });
          });
        });
      

        // @route GET api/users/current
        // @desc Return current user
        // @access Private
        router.get(
          '/current',
          passport.authenticate('jwt', { session: false }),
          (req, res) => {
            res.json({
              id: req.user.id,
              level:req.user.level,
              name: req.user.name,
              email: req.user.email,
              phone: req.user.phone,
              address: req.user.address,
              gender: req.user.gender,
              postcode:req.user.postcode,
              lat: req.user.lat,
              lng: req.user.lng,
              bookings:req.user.bookings

            }); 
          }
        );

// @route PUT api/users/makeBooking
// @desc Add booking details
// @access Private
router.put(
  "/makeBooking/:id",
  //   passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // if(req.user.level === 1) {

      const data = await User.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $push: {
            bookings: {
              clinicId: req.params.id,
              date: req.body.date            },
          },
        },{
          new: true
        }
      );

      // also push data into clinic collection
      const dataforClinic = await Clinic.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            bookings: {
              patientId:  req.body.userId,
              date: req.body.date            },
          },
        },{
          new: true
        }
      );
      console.log(data)
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

// @route GET api/users/allUsers
// @desc Retrive all users from database
// @access Private
router.get(
  "/allUsers",
  //   passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // if(req.user.level === 1) {
      const data = await User.find({});
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


router.get(
  "/allReports",
  //   passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // if(req.user.level === 1) {
      const data = await Report.find({});
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


router.get(
  "/bookingByUser/:id",
  //   passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // if(req.user.level === 1) {
      const data = await User.find({_id:req.params.id});
      res.json(data[0].bookings);
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
        
