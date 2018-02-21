// this is where strategies are defined

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user models
const User = mongoose.model('users');

// export the module
// pass the function an instance of passport
// this is where our local strategy is

module.exports = function(passport) {
  // define where local is when a user logs in
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, (email, password, done) => {
    // Match user
    User.findOne({
      email: email
    }).then(user => {
      if (!user) {
        return done(null, false, {
          message: 'No User Found'
        }); // there is no user so we return false
      }

      // Match password, we use bcrypt b/c pass is hashed
      // hashed-user.password, non hashed-password
      // isMatch is a t/f value
      // it takes in a callback which has an err and isMatch
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Password Incorrect'
          });
        }
      })
    })
  }));

  // from passportjs
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
