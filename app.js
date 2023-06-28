const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require("express-ejs-layouts");
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const dotenv = require('dotenv')
const app = express();
const connection = require('./schema/connection')
const connectionDB = require('./schema/connectionAtlas')



dotenv.config()
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
app.use(connection);



app.use('/', userRouter);
app.use('/admin', adminRouter);

const start = function () {
  try {
    connectionDB("mongodb+srv://anirudhvinod00:Anirudh2000@magesticgarments.lhts5rx.mongodb.net/?retryWrites=true&w=majority")
  }
  catch (err) {
    console.log(err);
  }
}
start()

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
  const users = req.session.user
  res.status(err.status || 500);
  res.render('error', { layout: 'emptylayout', users });
});

module.exports = app;
