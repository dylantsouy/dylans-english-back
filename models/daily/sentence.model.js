const mongoose = require('mongoose');

// title,english,chinese,words,showDate
const DailySentenceSchema = new mongoose.Schema(
  {
    english: {
      type: String,
      required: true,
      trim: true,
    },
    chinese: {
      type: String,
      required: true,
      trim: true,
    },
    words: {
      type: Array,
      trim: true,
    },
    showDate:{
      type: String,
      required: true,
      trim: true,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
    created: {
      type: Date,
      default: Date.now,
    }
  }, { versionKey: false }
);

const DailySentenceModel = mongoose.model('DailySentence', DailySentenceSchema);

module.exports = DailySentenceModel;