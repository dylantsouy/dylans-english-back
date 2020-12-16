const express = require('express');
const UserModel = require('../../models/user/user.model');
const WordModel = require('../../models/word/word.model');
const UserRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

/* Get 全部 */
UserRoute.get('/api/users', async (req, res, next) => {
  const { page, size } = req.query;
  await UserModel.find({})
    .then(data => {
      const dataLength = data.length;
      // 分頁
      let pageData = [];
      page && size ? (pageData = data.splice(size * (page - 1), size)) : (pageData = data);
      // 排序 order
      pageData.sort((a, b) => {
        const oderA = a.order;
        const oderB = b.order;
        if (oderA < oderB) return -1;
        if (oderA > oderB) return 1;
        return 0;
      });
      res.set('totalSize', dataLength);
      res.json(pageData);
    })
    .catch(err => {
      next(err)
      return
    })
});
/* Get goal  */
UserRoute.post('/api/users/getUser', express.json(), async (req, res, next) => {
  if (!req.body.username) {
    const error = {
      statusCode: 400,
      message: '沒有參數',
    };
    next(error)
    return
  }
  // 搜尋是否存在
  await UserModel.findOne({ username: req.body.username })
    .then(data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        next(error)
        return
      } else {
        res.json(data)
      }
    })
    .catch(e => {
      const error = {
        statusCode: 400,
        message: '查無資料',
      };
      next(error)
      return
    })
});

/* 查完成等級 */
UserRoute.post('/api/users/getUserLevel', express.json(), async (req, res, next) => {
  if (!req.body.username) {
    const error = {
      statusCode: 400,
      message: '沒有參數',
    };
    next(error)
    return
  }
  await UserModel.findOne({ username: req.body.username })
    .then(async data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        next(error)
        return
      } else {
        let dataLength = 0;
        await WordModel.find({})
          .then(data => {
             dataLength = data.length;
          })
        let level = {
          orange: 0,
          brown: 0,
          green: 0,
          blue: 0,
          gold: 0,
          remain: dataLength,
        };
        let orange = [];
        let brown = [];
        let green = [];
        let blue = [];
        let gold = [];
        data.knowWords.filter(e => {
          if (e.level === 'orange') {
            orange.push(e)
          }
          level.orange = orange.length
          if (e.level === 'brown') {
            brown.push(e)
          }
          level.brown = brown.length
          if (e.level === 'green') {
            green.push(e)
          }
          level.green = green.length
          if (e.level === 'blue') {
            blue.push(e)
          }
          level.blue = blue.length
          if (e.level === 'gold') {
            gold.push(e)
          }
          level.gold = gold.length
        })
        res.json(level)
      }
    })
    .catch(e => {
      next(e)
      return
    })
});
/* 查單字量 */
UserRoute.post('/api/users/getOverview', express.json(), async (req, res, next) => {
  if (!req.body.username) {
    const error = {
      statusCode: 400,
      message: '沒有參數',
    };
    next(error)
    return
  }
  await UserModel.findOne({ username: req.body.username })
    .then(data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        next(error)
        return
      } else {
        let overview = {
          first: 0,
          second: 0,
          third: 0,
          forth: 0,
          fifth: 0,
          sixth: 0
        };
        let first = [];
        let second = [];
        let third = [];
        let forth = [];
        let fifth = [];
        let sixth = [];
        console.log(data.knowWords);
        data.knowWords.filter(e => {
          if (e.year == 2021) {
            first.push(e)
          }
          overview.first = first.length
          if (e.year == 2022) {
            second.push(e)
          }
          overview.second = second.length
          if (e.year == 2023) {
            third.push(e)
          }
          overview.third = third.length
          if (e.year == 2024) {
            forth.push(e)
          }
          overview.forth = forth.length
          if (e.year == 2025) {
            fifth.push(e)
          }
          overview.fifth = fifth.length
          if (e.year == 2026) {
            sixth.push(e)
          }
          overview.sixth = sixth.length
        })
        res.json(overview)
      }
    })
    .catch(e => {
      const error = {
        statusCode: 400,
        message: '查無資料',
      };
      next(error)
      return
    })
});
/* 查會的單字 */
UserRoute.post('/api/users/getKnowWord', express.json(), async (req, res, next) => {
  if (!req.body.username) {
    const error = {
      statusCode: 400,
      message: '沒有參數',
    };
    next(error)
    return
  }
  await UserModel.findOne({ username: req.body.username })
    .then(data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        next(error)
        return
      } else {
        const knowWord = data.knowWords.map(e => e.word)
        res.json(knowWord)
      }
    })
    .catch(e => {
      next(e)
      return
    })
});
/* login */
UserRoute.post('/api/login', express.json(), async (req, res, next) => {
  // 搜尋是否存在
  await UserModel.findOne({ username: req.body.username })
    .then(data => {
      if (!data) {
        res.json({ success: false, message: '用戶不存在' })
      } else {
        const pwdMatchFlag = bcrypt.compareSync(req.body.password, data.password);
        if (pwdMatchFlag) {
          const token = jwt.sign(data.toJSON(), process.env.SECRET, { expiresIn: 10 * 1000 });
          res.json({ token });
        } else {
          res.json({ success: false, message: '驗證失敗,密碼錯誤' })
        }
      }
    })
    .catch(e => {
      next(e)
      return
    })
});

/* register */
UserRoute.post('/api/users', express.json(), async (req, res, next) => {
  const error = {
    statusCode: 400,
    message: '此用戶名已存在',
  };
  const error2 = {
    statusCode: 400,
    message: '密碼長度不符合規定',
  };
  if (!req.body.password) {
    next(error2);
    return;
  }
  if (req.body.password.length < 6 || req.body.password.length > 16) {
    next(error2);
    return;
  }
  const insertValues = {
    username: req.body.username,
    email: req.body.email,
    level: req.body.level ? req.body.level : 'user',
    name: req.body.name,
    avatar: req.body.avatar ? req.body.avatar : 'avatar.png',
    password: req.body.password
  };
  // 搜尋是否重複
  const goal = await UserModel.findOne({ username: req.body.username })
  if (!goal) {
    await new UserModel(insertValues).save()
      .then(data => {
        const token = jwt.sign(data.toJSON(), process.env.SECRET, { expiresIn: 10 * 1000 });
        res.json({ token });
      })
      .catch(err => next(err))
  } else {
    next(error);
    return;
  }
});

/* Put */
UserRoute.put('/api/users/:username', express.json(), async (req, res, next) => {
  // 搜尋是否存在 // 搜尋是否存在
  const goal = await UserModel.findOne({ username: req.params.username });
  if (req.body.password) {
    const error = {
      statusCode: 400,
      message: '惡意變更密碼',
    };
    next(error);
    return;
  }
  if (!goal) {
    const error = {
      statusCode: 400,
      message: '查無資料',
    };
    next(error);
    return;
  }
  // 搜尋是否重複
  const updateGoal = await UserModel.findOne({ username: req.body.username });
  if (updateGoal && req.body.username !== req.params.username) {
    const error = {
      statusCode: 400,
      message: '用戶名重複',
    };
    next(error);
    return;
  }
  req.body.updated = Date.now();
  // Try Validate
  await UserModel.updateOne({ username: req.params.username }, { $set: req.body })
    .then(() => res.json(req.body))
    .catch(err => next(err))
})

/* Delete */
UserRoute.delete('/api/users/:username', async (req, res, next) => {

  const message = {
    message: '刪除成功',
    username: req.params.username,
  };
  const error = {
    statusCode: 400,
    message: '查無資料',
  };

  // 搜尋是否存在
  await UserModel.findOne({ username: req.params.username })
    .then(async (data) => {
      await UserModel.deleteOne({ username: req.params.username })
        .then(data => data.deletedCount === 0 ? next(error) : res.json(message))
        .catch(err => {
          next(err)
          return
        })
    })
    .catch(e => {
      next(error)
      return
    });
});

module.exports = UserRoute;
