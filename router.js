const Auth = require('./controllers/auth');
const passportService = require('./services/passport');
const passport = require('passport');

// Middleware
// Authenticate JWT set session to false because Token is being used
// not cookies
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // Send root route through requireAuth() Middleware
  // then go on to request handler
  app.get('/', requireAuth, function(req, res) {
    res.send('Hello!');
  });

  app.post('/signin', requireSignin, Auth.signin);
  app.post('/signup', Auth.signup);
}