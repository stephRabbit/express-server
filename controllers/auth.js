const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

/**
 * Generate json web token(JWT) for user by Id
 * @param {* User Model } user
 */
function tokenForUser(user) {
  // Convention JWT have sub property which stands for subject
  // iat(issued at time)
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
  // User has already had email and password authenticated
  // just need to provide a token
  // user pass through localLogin -> return done(null, user);
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  // Get request content from req.body
  const email = req.body.email;
  const password = req.body.password;

  if (! email || ! password) {
    // Add extra email and password validation here
    res
      .status(422)
      .send({ error: 'You must provide an email and password' });
  }

  // See if a user with give email exists
  User.findOne({ email: email }, function(err, existingUser) {
    // Handle err and DB errors
    if (err) return next(err);

    // If a user with email does exist, throw an error
    // 422 - Unproccessable Entity
    if (existingUser) {
        res
          .status(422)
          .send({ error: 'Email has already been used!' });
    }

    // If a user with email does NOT exist, create user in memory
    const user = new User({
      email: email,
      password: password
    });

    // Save user record to DB
    user.save(function(err) {
      // Handle err and DB errors
      if (err) return next(err);

      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
};