// creating a seperate folder for our express Routes

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// use destructuring
// add this as a second parameter to any route we want to protect
const {ensureAuthenticated} = require('../helpers/auth');




//Load Idea model in the model folder
require('../models/Idea'); // we need to go outside the folder--> use '../'
const Idea = mongoose.model('ideas');

// Idea Index Page Routes // we want all of them, pass in empty
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});


//----------From Process----------
//Add idea form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

//Edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({  //we want to pass an object with a query, match it to the id
    _id: req.params.id // it gets id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  });
});

// Process Form, making post request
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser) // set newUser to object
      .save()
      .then(idea => { // its gonna return a promise
        req.flash('success_msg', 'Video idea added'); // send message for added
        res.redirect('/ideas'); // return ideas, redirected to /ideas
      })
  }
});

// Edit form Process, put requests
router.put('/:id', ensureAuthenticated , (req,res) => {
  //res.send('PUT');
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Video idea updated'); // send message for updated
        res.redirect('/ideas');
      }) //returns promise
  });
}); // we cant just chnage the method to put, we need help from the ovirride module
// override using query value


// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed');
      res.redirect('/ideas');
    });
});


module.exports = router;
