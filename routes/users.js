const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
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
    res.send('passed');
  }
});



module.exports = router;
