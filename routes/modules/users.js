const express = require('express')
const passport = require('passport')
const User = require('../../models/user')
const router = express.Router()
router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))
router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!email || !password || !confirmPassword) {
        errors.push({ message: 'Email、Password、Confirm Password欄位為必填！' })
    }
    if (password !== confirmPassword) {
        errors.push({ message: 'Password與Confirm Password不相符！' })
    }
    if (errors.length) {
        return res.render('register', { errors, name, email, password, confirmPassword })
    }
    User.findOne({ email })
        .then(user => {
            if (user) {
                errors.push({ message: '這個Email已經註冊過了！' })
                res.render('register', { errors, name, email, password, confirmPassword })
            }
            return User.create({ name, email, password, })
                .then(() => res.redirect('/'))
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err) }
        req.flash('success_msg', '你已經成功登出。')
        res.redirect('/users/login')
    })
})
module.exports = router