var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var factRouter = require('./routes/fact');
var oldIndexRouter = require('./routes/oldIndex');

var app = express();

const db = require('./data/db');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/fact', factRouter);
app.use('/old', oldIndexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

async function redis2db(){
  client.lpop('string inputCache', async function(err,img){
    if (img){
      await db.cat(img);
      console.log("saving to the database...")
    }
  });
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  setInterval( redis2db, 100);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
