'use strict'
const xss = require('xss')
const uuid = require('uuid')

const User = require('../models/user.js');

const userHelp = require('../dbHelp/userHelp.js');

/**
 * 注册新用户
 * @param {Function} next          [description]
 * @yield {[type]}   [description]
 */
exports.signup = async (ctx, next) => {
    let phoneNumber = xss(ctx.request.body.phoneNumber.trim())
    let user = await User.findOne({
        phoneNumber: phoneNumber
    }).exec()
    console.log(user)

    let verifyCode = Math.floor(Math.random() * 10000 + 1)
    console.log(phoneNumber)
    if (!user) {
        let accessToken = uuid.v4()

        user = new User({
            nickname: '测试用户',
            avatar: 'http://upload-images.jianshu.io/upload_images/5307186-eda1b28e54a4d48e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
            phoneNumber: xss(phoneNumber),
            verifyCode: verifyCode,
            accessToken: accessToken
        })
    } else {
        user.verifyCode = verifyCode
    }

    try {
        user = await user.save()
        ctx.body = {
            success: true
        }
    } catch (e) {
        ctx.body = {
            success: false
        }
        return next
    }
}

/**
 * 更新用户信息操作
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.update = async (ctx, next) => {
    let body = ctx.request.body
    let user = ctx.session.user
    let fields = 'avatar,gender,age,nickname,breed'.split(',')

    fields.forEach(function (field) {
        if (body[field]) {
            user[field] = xss(body[field].trim())
        }
    })

    user = await user.save()

    ctx.body = {
        success: true,
        data: {
            nickname: user.nickname,
            accessToken: user.accessToken,
            avatar: user.avatar,
            age: user.age,
            breed: user.breed,
            gender: user.gender,
            _id: user._id
        }
    }
}



/**
 * 数据库接口测试
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.users = async (ctx, next) => {
    let data = await userHelp.findAllUsers()
    // let obj = await userHelp.findByPhoneNumber({phoneNumber : '13525584568'})
    // console.log('obj=====================================>'+obj)

    ctx.body = {
        success: true,
        data
    }
}
exports.addUser = async (ctx, next) => {
    let user = new User({
        nickname: '测试用户',
        avatar: 'http://ip.example.com/u/xxx.png',
        phoneNumber: xss('13800138000'),
        verifyCode: '5896',
        accessToken: uuid.v4()
    })
    let user2 = await userHelp.addUser(user)
    if (user2) {
        ctx.body = {
            success: true,
            data: user2
        }
    }
}
exports.deleteUser = async (ctx, next) => {
    const phoneNumber = xss(ctx.request.body.phoneNumber.trim())
    console.log(phoneNumber)
    let data = await userHelp.deleteUser({
        phoneNumber
    })
    ctx.body = {
        success: true,
        data
    }
}