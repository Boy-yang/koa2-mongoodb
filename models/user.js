const mongoose = require('mongoose');

/**
 * 定义一个模式(相当于传统意义的表结构)
 * 每个模式映射mongoDB的一个集合，
 * 它定义（只是定义，不是实现）这个集合里面文档的结构，就是定义这个文档有什么字段，字段类型是什么，字段默认值是什么等。
 * 除了定义结构外，还定义文档的实例方法，静态模型方法，复合索引，中间件等
 * @type {mongoose}
 */
let UserSchema = new mongoose.Schema({
    phoneNumber: {
        unique: true,
        type: String
    },
    areaCode: String,
    verifyCode: String,
    verified: {
        type: Boolean,
        default: false
    },
    accessToken: String,
    nickname: String,
    gender: String,
    breed: String,
    age: String,
    avatar: String,
    meta: {
        createAt: {
            type: Date,
            dafault: Date.now()
        },
        updateAt: {
            type: Date,
            dafault: Date.now()
        }
    }
});

// Defines a pre hook for the document.
UserSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
});

// 参数User为数据库中的集合名称, 不存在会创建.
let User = mongoose.model('User', UserSchema);
module.exports = User;