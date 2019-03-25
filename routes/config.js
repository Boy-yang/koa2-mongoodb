'use strict'
const router = require('koa-router')()
const User = require('../controllers/user')
const App = require('../controllers/app')

router.prefix('/api');

// user
router.post('/u/signup', App.hasBody, User.signup)
router.post('/u/update', App.hasBody, App.hasToken, User.update)

// DB Interface test
router.get('/test/user/users', User.users)
router.post('/test/user/add', User.addUser)
router.post('/test/user/delete', User.deleteUser)

module.exports = router;