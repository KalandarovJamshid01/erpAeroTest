const express = require('express');
const app = express();
const ErrorController = require('./../controller/errorController');
const AppError = require('../util/AppError');
const { apiLimiter, apiLimiterUpload } = require('./../util/appLimiter');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');



app.use(morgan('tiny'));
app.set('trust proxy', 1);
app.use('/uploads', express.static('uploads'));
app.use('/download', express.static('public'));

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(cookieParser());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../view'));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json({ limit: '1000000kb' }));

app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(hpp());

app.use(express.json());


app.all('*', function (req, res, next) {
  next(new AppError(`This url has not found: ${req.originalUrl}`, 404));
});

app.use(ErrorController);

module.exports = app;
