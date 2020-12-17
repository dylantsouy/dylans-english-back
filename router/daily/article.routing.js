const express = require('express');
const DailyArticleModel = require('../../models/daily/article.model');
const DailArticleRoute = express.Router();

// title,english,chinese,words,showDate

/* Get today's dailyarticle */
DailArticleRoute.get('/api/dailyarticle', async (req, res, next) => {
  const { page, size } = req.query;
  const showDate = `${new Date().getFullYear()}/${(new Date().getMonth() + 1)}/${new Date().getDate()}`;
  // 搜尋是否存在
  await DailyArticleModel.find({ showDate: showDate })
    .then(async (data) => {
      if (data && !data.length) {
        await DailyArticleModel.find({}).then(data => {
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
DailArticleRoute.post('/api/dailyarticle', express.json(), async (req, res, next) => {
  const { title, english, chinese, words, showDate } = req.body;
  // Try Validate
  await new DailyArticleModel({ title, english, chinese, words, showDate }).save()
    .then(data => res.json(req.body))
    .catch(err => next(err))
});

/* Put */
DailArticleRoute.put('/api/dailyarticle/:_id', express.json(), async (req, res, next) => {
  // 搜尋是否存在
  await DailyArticleModel.findById(req.params._id)
    .then(async (data) => {
      req.body.updated = Date.now()
      await DailyArticleModel.updateOne({ _id: req.params._id }, { $set: req.body })
        .then(data => res.json(req.body))
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
DailArticleRoute.delete('/api/dailyarticle/:_id', async (req, res, next) => {
  const message = {
    message: '刪除成功',
    _id: req.params._id,
  };
  const error = {
    statusCode: 400,
    message: '查無資料',
  };
  // 搜尋是否存在
  await DailyArticleModel.findByIdAndDelete(req.params._id)
    .then(data => {
      data === null ? res.json(error) : res.json(message)
    })
    .catch(e => {
      next(e)
      return
    });
})

module.exports = DailArticleRoute;
