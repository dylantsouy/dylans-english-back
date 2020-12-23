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
    res.json(error)
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
        res.json(error)
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
      res.json(error)
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
    res.json(error)
    return
  }
  await UserModel.findOne({ username: req.body.username })
    .then(async data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        res.json(error)
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
    res.json(error)
    return
  }
  await UserModel.findOne({ username: req.body.username })
    .then(data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        res.json(error)
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
          if (e.year == 2020) {
            first.push(e)
          }
          overview.first = first.length
          if (e.year == 2021) {
            second.push(e)
          }
          overview.second = second.length
          if (e.year == 2022) {
            third.push(e)
          }
          overview.third = third.length
          if (e.year == 2023) {
            forth.push(e)
          }
          overview.forth = forth.length
          if (e.year == 2024) {
            fifth.push(e)
          }
          overview.fifth = fifth.length
          if (e.year == 2025) {
            sixth.push(e)
          }
          overview.sixth = sixth.length
        })
        res.json(overview)
      }
    })
    .catch(e => {
      next(e)
      return
    })
});

/* 查備註的單字 */
UserRoute.post('/api/users/getNotedWord', express.json(), async (req, res, next) => {
  if (!req.body.username) {
    const error = {
      statusCode: 400,
      message: '沒有參數',
    };
    res.json(error)
    return
  }
  await UserModel.findOne({ username: req.body.username })
    .then(data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        res.json(error)
        return
      } else {
        const notedWords = data.notedWords.map(e => e.word)
        res.json(notedWords)
      }
    })
    .catch(e => {
      next(e)
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
    res.json(error)
    return
  }
  await UserModel.findOne({ username: req.body.username })
    .then(data => {
      if (!data) {
        const error = {
          statusCode: 400,
          message: '查無資料',
        };
        res.json(error)
        return
      } else {
        const knowWords = data.knowWords.map(e => e.word)
        res.json(knowWords)
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
    .then(async data => {
      if (!data) {
        res.json({ success: false, message: '用戶不存在' })
      } else {
        const pwdMatchFlag = bcrypt.compareSync(req.body.password, data.password);
        if (pwdMatchFlag) {
          const token = jwt.sign(data.toJSON(), process.env.SECRET, { expiresIn: 10 * 1000 });
          const loginDate = Date.now();
          await UserModel.updateOne({ username: req.body.username }, { $set: { loginDate: loginDate } })
            .then(() => res.json({ token }))
            .catch(err => next(err))
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
    res.json(error)
    return;
  }
  if (req.body.password.length < 6 || req.body.password.length > 16) {
    res.json(error2)
    return;
  }
  const insertValues = {
    username: req.body.username,
    email: req.body.email,
    level: req.body.level ? req.body.level : 'user',
    name: req.body.name,
    gender: req.body.gender,
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
      .catch(err => {
        next(err)
        return
      })
  } else {
    res.json(error)
    return;
  }
});
/* 新增備註單字 */
UserRoute.post('/api/users/addNotedWord', express.json(), async (req, res, next) => {
  if (!req.body.word) {
    const error = {
      statusCode: 400,
      message: '請輸入單字',
    };
    res.json(error)
    return
  }
  // 搜尋是否存在
  await WordModel.findOne({ word: req.body.word })
    .then(async goal => {
      if (!goal) {
        const error = {
          statusCode: 400,
          message: '很抱歉，此單字還未有資料',
        };
        res.json(error)
        return
      } else {
        await UserModel.findOne({ username: req.body.username })
          .then(async user => {
            if (!user) {
              const error = {
                statusCode: 400,
                message: '用戶資料錯誤',
              };
              res.json(error)
              return
            } else {
              if (user.notedWords.map(e => e.word).indexOf(req.body.word) === -1) {
                const noted = { word: goal.word, chinese: goal.chinese, speech: goal.speech }
                user.notedWords.push(noted)

                user.updated = Date.now();
                // Try Validate
                await UserModel.updateOne({ username: req.body.username }, { $set: user })
                  .then(() =>
                    res.json({
                      statusCode: 200,
                      message: '新增備註單字成功'
                    }))
                  .catch(err => {
                    next(err)
                    return;
                  })
              } else {
                const error = {
                  statusCode: 400,
                  message: '此單字已在您的備註欄裡',
                };
                res.json(error)
                return;
              }

            }
          })
          .catch(e => {
            next(e)
            return
          })
      }
    })
    .catch(e => {
      next(e)
      return
    })
});
/* 刪除備註單字 */
UserRoute.post('/api/users/removeNotedWord', express.json(), async (req, res, next) => {
  await UserModel.findOne({ username: req.body.username })
    .then(async user => {
      if (!user) {
        const error = {
          statusCode: 400,
          message: '用戶資料錯誤',
        };
        res.json(error)
        return
      } else {
        if (user.notedWords.map(e => e.word).indexOf(req.body.word) === -1) {
          const error = {
            statusCode: 400,
            message: '無此備註單字',
          };
          res.json(error)
          return
        }
        user.notedWords.splice(user.notedWords.map(e => e.word).indexOf(req.body.word), 1)
        user.updated = Date.now();
        // Try Validate
        await UserModel.updateOne({ username: req.body.username }, { $set: user })
          .then(() =>
            res.json({
              statusCode: 200,
              message: '刪除備註單字成功'
            }))
          .catch(err => {
            next(err)
            return;
          })
      }
    })
    .catch(e => {
      next(e)
      return
    })
});

/* 新增know單字 */
UserRoute.post('/api/users/addKnowWord', express.json(), async (req, res, next) => {
  if (!req.body.word) {
    const error = {
      statusCode: 400,
      message: '請輸入單字',
    };
    res.json(error)
    return
  }
  // 搜尋是否存在
  await WordModel.findOne({ word: req.body.word })
    .then(async goal => {
      if (!goal) {
        const error = {
          statusCode: 400,
          message: '很抱歉，此單字還未有資料',
        };
        res.json(error)
        return
      } else {
        await UserModel.findOne({ username: req.body.username })
          .then(async user => {
            if (!user) {
              const error = {
                statusCode: 400,
                message: '用戶資料錯誤',
              };
              res.json(error)
              return
            } else {
              if (user.knowWords.map(e => e.word).indexOf(req.body.word) === -1) {
                const know = { word: goal.word, year: new Date().getFullYear(), level: goal.level, lesson: goal.lesson }
                user.knowWords.push(know)
                user.updated = Date.now();
                // Try Validate
                await UserModel.updateOne({ username: req.body.username }, { $set: user })
                  .then(() =>
                    res.json({
                      statusCode: 200,
                      message: '新增為記熟單字'
                    }))
                  .catch(err => {
                    next(err)
                    return;
                  })
              } else {
                const error = {
                  statusCode: 400,
                  message: '單字重複',
                };
                res.json(error)
                return;
              }

            }
          })
          .catch(e => {
            next(e)
            return
          })
      }
    })
    .catch(e => {
      next(e)
      return
    })
});
/* 刪除已知單字 */
UserRoute.post('/api/users/removeKnowWord', express.json(), async (req, res, next) => {
  await UserModel.findOne({ username: req.body.username })
    .then(async user => {
      if (!user) {
        const error = {
          statusCode: 400,
          message: '用戶資料錯誤',
        };
        res.json(error)
        return
      } else {
        if (user.knowWords.map(e => e.word).indexOf(req.body.word) === -1) {
          const error = {
            statusCode: 400,
            message: '無此單字',
          };
          res.json(error)
          return
        }
        user.knowWords.splice(user.knowWords.map(e => e.word).indexOf(req.body.word), 1)
        user.updated = Date.now();
        // Try Validate
        await UserModel.updateOne({ username: req.body.username }, { $set: user })
          .then(() =>
            res.json({
              statusCode: 200,
              message: '刪除記熟單字成功'
            }))
          .catch(err => {
            next(err)
            return;
          })
      }
    })
    .catch(e => {
      next(e)
      return
    })
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
    res.json(error)
    return;
  }
  if (!goal) {
    const error = {
      statusCode: 400,
      message: '查無資料',
    };
    res.json(error)
    return;
  }
  // 搜尋是否重複
  const updateGoal = await UserModel.findOne({ username: req.body.username });
  if (updateGoal && req.body.username !== req.params.username) {
    const error = {
      statusCode: 400,
      message: '用戶名重複',
    };
    res.json(error)
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
      next(e)
      return
    });
});

module.exports = UserRoute;
