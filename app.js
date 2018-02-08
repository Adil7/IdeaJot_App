const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');

//initialize app
const app = express();

conolse.log('this is a test git commit');

//Map global promise = get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-db', {})
  .then(function() {
    console.log("MongoDB connected ...");
  })
  .catch(err => console.log(err));

//Load Idea model in the model folder
require('./models/Idea');
const Idea = mongoose.model('ideas');

//----------Middleware----------

//Handle bars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
})); //telling system we want to use handlebar system
app.set('view engine', 'handlebars');

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

//Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// from const flash
app.use(flash());

// Global variables for messages, request response and next
app.use(function(req, res, next){
  // creates global var
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next(); // we call next for the next middleware piece
});


//How middleware works
// app.use(function (req, res, next) {
//   //console.log(Date.now());
//   req.name = 'Adil 7'
//   next();
// });

//----------Routes----------

//Index route
app.get('/', (req, res) => {
  const title = 'Welcome Home'; //data into views
  console.log(req.name);
  res.render('index', {
    title: title
  }); // sends something to browser
}); // we are handling a get request, post/put is used for updating

// About route
app.get('/about', (req, res) => {
  res.render('about');
});

// Idea Index Page Routes // we want all of them, pass in empty
app.get('/ideas', (req, res) => {
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
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Edit idea form
app.get('/ideas/edit/:id', (req, res) => {
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
app.post('/ideas', (req, res) => {
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
        req.flash('success_msg', 'Video idea updated'); // send message for update
        res.redirect('/ideas'); // return ideas, redirected to /ideas
      })
  }
});

// Edit form Process, put requests
app.put('/ideas/:id', (req,res) => {
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
        res.redirect('/ideas');
      }) //returns promise
  });
}); // we cant just chnage the method to put, we need help from the ovirride module
// override using query value


// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Video idea removed');
      res.redirect('/ideas');
    });
});


//----------Port----------
const port = 5000;
//listens to a certain port
app.listen(port, () => {
  //template literal, allows us to use vars without concat
  console.log(`Server started on port ${port}`);
});
