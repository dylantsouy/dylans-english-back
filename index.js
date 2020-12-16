const express = require("express");
const expressHandlebars = require("express-handlebars");
const cookieParser = require('cookie-parser');

const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const db = require("./db");
const Routing = require("./router/routing");
const PORT = process.env.PORT || 5000;

db.connect();

const app = express();
app.use(cors({ origin: '*' }))
  .set('SECRET', process.env.SECRET)
  .use(cookieParser())
  .use(express.static(path.join(__dirname, "public"))) // configure static path
  .set("view engine", "handlebars") // configure Handlebars view engine
  .engine("handlebars", expressHandlebars({ defaultLayout: "index" })) // configure default layout path
  .use(helmet.hidePoweredBy()) // helmet setting: https://expressjs.com/zh-tw/advanced/best-practice-security.html

  // configure routing
  .use("/", Routing)
  .listen(PORT || 5000, () => console.log(`Listening on http://localhost:${PORT}`)); // listen on port