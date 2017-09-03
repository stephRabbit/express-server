const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define model class
// -----------------------
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
});

// On save hook, encrypt password
// ----------------------

// Before user gets saved
userSchema.pre('save', function(next) {
  // context of the user model
  const user = this;

  // Generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // Hash(encrypt) password using salt then run callback
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);

      // Overwrite plain text password with hashed/encrypted password
      user.password = hash;
      // Save model
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);

    // Call the callback err = null, isMatch = true
    callback(null, isMatch);
  });
};

// Create model class
// -----------------------
const ModelClass = mongoose.model('user', userSchema);

// Export model class
// -----------------------
module.exports = ModelClass;