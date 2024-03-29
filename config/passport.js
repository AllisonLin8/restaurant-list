const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

module.exports = app => {
    // 1.設定middleware-初始化passport套件
    app.use(passport.initialize())
    app.use(passport.session())
    // 2-1.設定登入策略-本地登入
    passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
        (req, email, password, done) => {
            User.findOne({ email })
                .then(user => {
                    if (!user) {
                        return done(null, false, req.flash("warning_msg", "這個Email沒有註冊過。"))
                    }
                    return bcrypt.compare(password, user.password)
                        .then(isMatch => {
                            if (!isMatch) {
                                return done(null, false, req.flash("warning_msg", "Email或Password不正確。"))
                            }
                            return done(null, user)
                        })
                })
                .catch(err => done(err, false))
        }))
    // 2-2.設定登入策略-facebook登入
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
    }, (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({ email })
            .then(user => {
                if (user) return done(null, user)
                const randomPassword = Math.random().toString(36).slice(-8)
                bcrypt.genSalt(10)
                    .then(salt => bcrypt.hash(randomPassword, salt))
                    .then(hash => User.create({ name, email, password: hash }))
                    .then(user => done(null, user))
                    .catch(err => done(err, false))
            })
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