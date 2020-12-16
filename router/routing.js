const UserRoute = require('./user/user.routing');
const WordRoute = require('./word/word.routing');
const DailyWordRoute = require('./daily/word.routing');
const DailySentenceRoute = require('./daily/sentence.routing');
const DailyArticleRoute = require('./daily/article.routing');
const express = require('express');

const Routing = express();

Routing.get('/', (req, res) => res.render('home'));

Routing.use('/', WordRoute);
Routing.use('/', DailySentenceRoute);
Routing.use('/', DailyWordRoute);
Routing.use('/', DailyArticleRoute);
Routing.use('/', UserRoute);

Routing.use('*', (req, res) => res.render('404'))


Routing.use((error, req, res, next) => {
    if (!error.statusCode) error.statusCode = 500;

    if (error.statusCode === 301) {
        return res.redirect(303, '/')
    }

    return res
        .status(error.statusCode)
        .json({ error });
});

module.exports = Routing