const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require("express-ejs-layouts");
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const database = require('./schema/dbSchma')
const ConnectMongodbSession = require('connect-mongodb-session')
const session = require('express-session')

const app = express();
const mongodbSession = new ConnectMongodbSession(session)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "public/admin-assets")))

// Add session middleware before any routes or error handlers
app.use(session({
  saveUninitialized: true,
  secret: 'sessionSecret',
  resave: false,
  store: new mongodbSession({
    uri: "mongodb://0.0.0.0/E-commerce",
    collection: "session"
  }),
  cookie: {
    maxAge: 1000 * 60 * 24 * 10, // 10 days
  }
}));

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
