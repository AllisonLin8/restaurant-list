const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
    // 1.設定middleware-初始化passport套件
    app.use(passport.initialize())
    app.use(passport.session())
    // 2-1.設定登入策略-本地登入
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'That email is not registered!' })
                }
                return bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return done(null, false, { message: 'Email or Password incorrect.' })
                        }
                        return done(null, user)
                    })
                return done(null, user)
            })
            .catch(err => done(err, false))
    }))
    // 3.設定序列化與反序列化
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}