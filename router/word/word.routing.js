const express = require('express');
const WordModel = require('../../models/word/word.model');
const WordRoute = express.Router();

// Model:word,chinese,lesson,level,speech,sentence,sentenceChinese,phrase,derivative,synonym,antonym,note,audio,updated,created

/* Get all */
WordRoute.get('/api/words', async (req, res, next) => {
  const { page, size } = req.query;
  await WordModel.find({})
    .then(data => {
      const dataLength = data.length;
      // 分頁
      let pageData = [];
      page && size ? (pageData = data.splice(size * (page - 1), size)) : (pageData = data);
      res.set('totalSize', dataLength);
      res.json(pageData);
    })
    .catch(err => {
      next(err)
      return
    })
});

/* Get goal level's all Lesson */
WordRoute.post('/api/words/getLessonsByLevel', express.json(), async (req, res, next) => {
  await WordModel.find({ level: req.body.level })
    .then(data => {
      // 排序 order
      if (data) {
        data = data.map(e => e.lesson);
        const result = [...(new Set(data))];
        result.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        })
        res.json(result);
      }
      else res.json(data);
    })
    .catch(err => {
      next(err)
      return
    })
});

/* Get by goal level's goal Lesson */
WordRoute.post('/api/words/getWordsByLesson', express.json(), async (req, res, next) => {
  const { page, size } = req.query;
  const { level, lesson } = req.body;
  // 搜尋是否存在
  await WordModel.find({ level: level, lesson: lesson })
    .then(data => {
      if (data && !data.length) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        res.json(error)
        return
      }
      // 分頁
      const dataLength = data.length;
      let pageData = [];
      page && size ? (pageData = data.splice(size * (page - 1), size)) : (pageData = data);
      res.set('totalSize', dataLength);
      res.json(pageData);
    })
    .catch(err => {
      next(err)
      return
    })
});

/* Get goal word */
WordRoute.post('/api/words/getWordsByWord', express.json(), async (req, res, next) => {
  if (!req.body.word) {
    const error = {
      statusCode: 400,
      message: '沒有參數',
    };
    res.json(error)
    return
  }
  // 搜尋是否存在
  await WordModel.findOne({ word: req.body.word })
    .then(data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        res.json(error)
        return
      } else {
        res.json(data)
      }
    })
    .catch(e => {
      res.json(e)
      return
    })
});

/* Post */
WordRoute.post('/api/words', express.json(), async (req, res, next) => {
  const { word, chinese, lesson, level, speech, sentence, sentenceChinese, phrase, derivative, synonym, antonym, note } = req.body;
  // Try Validate
  const audio = word;
  await new WordModel({ word, chinese, lesson, level, speech, sentence, sentenceChinese, phrase, derivative, synonym, antonym, note, audio }).save()
    .then(() => res.json(req.body))
    .catch(err => next(err))
});

/* Put */
WordRoute.put('/api/words/:_id', express.json(), async (req, res, next) => {
  // 搜尋是否存在
  await WordModel.findById(req.params._id)
    .then(async () => {
      req.body.updated = Date.now()
      await WordModel.updateOne({ _id: req.params._id }, { $set: req.body })
        .then(() => res.json(req.body))
        .catch(err => {
          next(err)
          return
        })
    })
    .catch(e => {
      const error = {
        statusCode: 400,
        message: '查無資料',
      };
      res.json(error)
      return
    });
});

/* Delete */
WordRoute.delete('/api/words/:_id', async (req, res, next) => {
  const message = {
    message: '刪除成功',
    _id: req.params._id,
  };
  const error = {
    statusCode: 400,
    message: '查無資料',
  };
  // 搜尋是否存在
  await WordModel.findByIdAndDelete(req.params._id)
    .then(data => {
      data === null ? next(error) : res.json(message)
    })
    .catch(e => {
      res.json(error)
      return
    });
})

module.exports = WordRoute;
