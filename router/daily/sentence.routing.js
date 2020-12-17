const express = require('express');
const DailySentenceModel = require('../../models/daily/sentence.model');
const DailSentenceRoute = express.Router();

// title,english,chinese,words,showDate

/* Get today's dailysentence */
DailSentenceRoute.get('/api/dailysentence', async (req, res, next) => {
  const { page, size } = req.query;
  const showDate = `${new Date().getFullYear()}/${(new Date().getMonth() + 1)}/${new Date().getDate()}`;
  // 搜尋是否存在
  await DailySentenceModel.find({ showDate: showDate })
    .then(async (data) => {
      if (data && !data.length) {
        await DailySentenceModel.find({}).then(data => {
          const randomData = data.sort(function () {
            return (0.5 - Math.random());
          }).splice(0, 1);
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
DailSentenceRoute.post('/api/dailysentence', express.json(), async (req, res, next) => {
  const { english, chinese, words, showDate } = req.body;
  // Try Validate
  await new DailySentenceModel({ english, chinese, words, showDate }).save()
    .then(() => res.json(req.body))
    .catch(err => next(err))
});

/* Put */
DailSentenceRoute.put('/api/dailysentence/:_id', express.json(), async (req, res, next) => {
  // 搜尋是否存在
  await DailySentenceModel.findById(req.params._id)
    .then(async () => {
      req.body.updated = Date.now()
      await DailySentenceModel.updateOne({ _id: req.params._id }, { $set: req.body })
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
DailSentenceRoute.delete('/api/dailysentence/:_id', async (req, res, next) => {
  const message = {
    message: '刪除成功',
    _id: req.params._id,
  };
  const error = {
    statusCode: 400,
    message: '查無資料',
  };
  // 搜尋是否存在
  await DailySentenceModel.findByIdAndDelete(req.params._id)
    .then(data => {
      data === null ?  res.json(error) : res.json(message)
    })
    .catch(e => {
      next(e)
      return
    });
})

module.exports = DailSentenceRoute;
