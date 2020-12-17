const express = require('express');
const DailyWordModel = require('../../models/daily/word.model');
const DailyWordRoute = express.Router();

// word,chinese,speech,sentence,sentenceChinese,showDate

/* Get today's dailywords */
DailyWordRoute.get('/api/dailywords', async (req, res, next) => {
  const { page, size } = req.query;
  const showDate = `${new Date().getFullYear()}/${(new Date().getMonth() + 1)}/${new Date().getDate()}`;
  // 搜尋是否存在
  await DailyWordModel.find({ showDate: showDate })
    .then(async (data) => {
      if (data && !data.length) {
        await DailyWordModel.find({}).then(data => {
          const randomData = data.sort(function () {
            return (0.5 - Math.random());
          }).splice(0, 5);
          res.json(randomData);
          return
        })
          .catch(err => {
            next(err)
            return
          })
      } else {
        // 分頁
        const dataLength = data.length;
        let pageData = [];
        page && size ? (pageData = data.splice(size * (page - 1), size)) : (pageData = data);
        res.set('totalSize', dataLength);
        res.json(pageData);

      }
    })
    .catch(err => {
      next(err)
      return
    })
});

/* Post */
DailyWordRoute.post('/api/dailywords', express.json(), async (req, res, next) => {
  const { word, chinese, speech, sentence, sentenceChinese, showDate } = req.body;
  // Try Validate
  await new DailyWordModel({ word, chinese, speech, sentence, sentenceChinese, showDate }).save()
    .then(() => res.json(req.body))
    .catch(err => next(err))
});

/* Put */
DailyWordRoute.put('/api/dailywords/:_id', express.json(), async (req, res, next) => {
  // 搜尋是否存在
  await DailyWordModel.findById(req.params._id)
    .then(async () => {
      req.body.updated = Date.now()
      await DailyWordModel.updateOne({ _id: req.params._id }, { $set: req.body })
        .then(() => res.json(req.body))
        .catch(err => {
          next(err)
          return
        })
    })
    .catch(e => {
      next(e)
      return
    });
});

/* Delete */
DailyWordRoute.delete('/api/dailywords/:_id', async (req, res, next) => {
  const message = {
    message: '刪除成功',
    _id: req.params._id,
  };
  const error = {
    statusCode: 400,
    message: '查無資料',
  };
  // 搜尋是否存在
  await DailyWordModel.findByIdAndDelete(req.params._id)
    .then(data => {
      data === null ? res.json(error) : res.json(message)
    })
    .catch(e => {
      next(e)
      return
    });
})

module.exports = DailyWordRoute;
