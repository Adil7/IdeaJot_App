const express = require('express');
const path = require('path'); // joins file paths //for the public folder
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');


//initialize app
const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Map global promise = get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-db', {})
  .then(function() {
    console.log("MongoDB connected ...");
  })
  .catch(err => console.log(err));



//----------Middleware----------

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

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




// Using routes
app.use('/ideas', ideas); // it will go to the idea route, through linking
app.use('/users', users);


//----------Port----------
const port = 5000;
//listens to a certain port
app.listen(port, () => {
  //template literal, allows us to use vars without concat
  console.log(`Server started on port ${port}`);
});
