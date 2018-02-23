// module.exports - gives access to other files
module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){ // from passportjs, if true we
                              //  call the next middleware/func, else we redirect
      return next();
    } // else
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/login');
  }
}

// use this to protect routes
