const mongoose = require('mongoose');

// word,chinese,speech,sentence,sentenceChinese,showDate,updated,created
const DailyWordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
    },
    chinese: {
      type: String,
      required: true,
      trim: true,
    },
    speech: {
      type: String,
      default: 'n',
      trim: true,
    },
    sentence: {
      type: String,
      required: true,
      trim: true,
    },
    sentenceChinese: {
      type: String,
      required: true,
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

const DailyWordModel = mongoose.model('DailyWord', DailyWordSchema);

module.exports = DailyWordModel;