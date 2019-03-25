'use strict'
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const router = require('./routes/config');
require("@babel/register");

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(session(app))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

//connect-db
/**
 * mongoose连接数据库
 * @type {[type]}
 */
mongoose.Promise = require('bluebird');

const DB_URL = 'mongodb://localhost:27017/test';
mongoose.connect(DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true
});

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + DB_URL);
});
/**
 * 连接异常
 */
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
});

/**
 * 获取数据库表对应的js对象所在的路径
 * @type {[type]}
 */
const models_path = path.join(__dirname, './models')
/**
 * 用递归的形式，读取models文件夹下的js模型文件，并require
 * @param  {[type]} modelPath [description]
 * @return {[type]}           [description]
 */
const walk = function (modelPath) {
  fs.readdirSync(modelPath).forEach(file => {
    let filePath = path.join(modelPath, '/' + file);
    let stat = fs.statSync(filePath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(filePath);
      }
    } else if (stat.isDirectory()) {
      walk(filePath);
    }
  })
}
walk(models_path);
module.exports = app;