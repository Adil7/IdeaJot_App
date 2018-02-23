const express = require('express');
const path = require('path'); // joins file paths //for the public folder
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport')

//initialize app
const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');


// Passport Config
require('./config/passport')(passport);

//DB config for mlab
const db = require('./config/database');


const mongoose = require('mongoose');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


//----------Middleware----------


//Handle bars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
})); //telling system we want to use handlebar system
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
// important this is afer express session Middleware

app.use(passport.initialize());
app.use(passport.session());

// from const flash
app.use(flash());

// Global variables for messages, request response and next
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // when you login and see the navbar options
  res.locals.user = req.user || null;
  // we call next for the next middleware piece
  next();
});


//How middleware works
// app.use(function (req, res, next) {
//   //console.log(Date.now());
//   req.name = 'Adil 7'
//   next();
// });

//----------Routes----------

//Index route
// sends something to browser
// we are handling a get request, post/put is used for updating
app.get('/', (req, res) => {
  //data into views
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About route
app.get('/about', (req, res) => {
  res.render('about');
});


// Using routes
// it will go to the idea route, through linking
app.use('/ideas', ideas);
app.use('/users', users);




//----------Port----------
// deploy to heroku or local host
const port = process.env.PORT || 5000;
//listens to a certain port
app.listen(port, () => {
  //template literal, allows us to use vars without concat
  console.log(`Server started on port ${port}`);
});
