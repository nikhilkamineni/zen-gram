const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  pages: [
    {
      handle: { type: String, required: true, unique: true },
      dateAdded: { type: Date, required: true, default: Date.now }
    }
  ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
