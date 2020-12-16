const mongoose = require('mongoose');

// word,chinese,lesson,level,speech,sentence,sentenceChinese,phrase,derivative,synonym,antonym,note,audio,updated,created
const WordSchema = new mongoose.Schema(
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
    level: {
      type: String,
      required: true,
      trim: true,
    },
    lesson: {
      type: Number,
      required: true,
      trim: true,
    },
    speech: {
      type: String,
      required: true,
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
    phrase: {
      type: String,
      default: '',
      trim: true,
    },
    derivative: {
      type: String,
      default: '',
      trim: true,
    },
    synonym: {
      type: String,
      default: '',
      trim: true,
    },
    antonym: {
      type: String,
      default: '',
      trim: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    audio: {
      type: String,
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

const WordModel = mongoose.model('Word', WordSchema);

module.exports = WordModel;