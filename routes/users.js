const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
// load the model into var, and load users models
const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});


// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register form post
// console.log(req.body); // print out form content
//   res.send('register');



router.post('/register', (req, res) => {
  let errors = [];

    // check if the password matches password2
    // push a object with text, passes do not matches
  if(req.body.password != req.body.password2){
    errors.push({text:'Passwords do not match'});
  }

  // check the length of the password for being too short, must be atleast 4 chars
  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'});
  }

  // check if the error array has anything in it, if its greater than zero we re render the form
  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name, // pass in the parameters
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // double email check
    User.findOne({email: req.body.email})
      .then (user => {
        if (user){ // cehck for user if there is this email present
          req.flash('error_msg', 'Email already registered');
          res.redirect('/users/register');
        } else {
          // new user object from our form field
          const newUser =  User ({ // when we create this object we need to wrap it in ()
            name: req.body.name, // pass in the parameters
            email: req.body.email,
            password: req.body.password,
          });
          // encrpt password using bcryptjs, how many params, then function
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash ; // store hash pass in db, then we must save it
              newUser.save() // returns a promise
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can login');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });

          });
          //res.send('passed'); // handle this
        }
      });




  }
});


// Logout User Functionality

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out!') // send a msg to screen
  res.redirect('/users/login'); // redirect user to login page after they logout
});

module.exports = router;
