const mongoose = require('mongoose');
const EmailValidator = require('../../validators/validators');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 16,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: EmailValidator
      }
    },
    level: {
      type: String,
      default: 'user',
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'avatar.png',
    },
    knowWords: {
      type: Array,
      trim: true,
      default: [],
    },
    notedWords: {
      type: Array,
      trim: true,
      default: [],
    },
    loginDate: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  }, { versionKey: false }
);

// hash user password before saving into database
UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

module.exports = mongoose.model('User', UserSchema);