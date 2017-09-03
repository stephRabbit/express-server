const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

// Set up options to configure strategy
const localOptions = {
  // setting the username to look at email property
  usernameField: 'email'
};

// Create local strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done() with the user
  // if it is the correct email and password
  // otherwise, call done() with false
  User.findOne({ email: email }, function(err, user) {
    // DB error handling
    if (err) return next(err);

    // No err = null, user = false(not found)
    if (! user) return done(null, false);

    // Compare passwords(password === user.password)
    user.comparePassword(password, function(err, isMatch) {
      // DB error handling
      if (err) return done(err);

      // Call done() err = null, isMatch = false
      if (! isMatch) return done(null, false);

      // Call done err = null, isMatch = true(user)
      return done(null, user);
    });
  });
});

// Set up options to configure strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload - decoded JWT(user.id, timestamp) from auth -> tokenForUser(user)
  // done - callback

  // See if user ID exist in DB
  // If it does, call 'done' with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    // Call .done() with err = err object, false = user object
    if (err) return done(err, false);

    if (user) {
      // Call .done() without err = null, user = user object
      done(null, user);
    }
    else {
      // Call .done() with err = null, false = user object
      done(null, false);
    }
  });
})

// Tell passport to use strategy
passport.use(jwtLogin);
passport.use(localLogin);
