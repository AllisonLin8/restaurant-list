const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 瀏覽新增餐廳的頁面
router.get('/new', (req, res) => {
    res.render('new')
})
// 提交新的餐廳資料
router.post('/', (req, res) => {
    const newData = req.body
    newData.userId = req.user._id
    return Restaurant.create(newData)
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
})
// 瀏覽某一間餐廳的資訊頁面
router.get('/:restaurant_id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.restaurant_id
    return Restaurant.findOne({ _id, userId })
        .lean()
        .then(restaurant => res.render('show', { restaurant }))
        .catch(error => console.error(error))
})
// 修改餐廳資訊的頁面
router.get('/:restaurant_id/edit', (req, res) => {
    const userId = req.user._id
    const _id = req.params.restaurant_id
    return Restaurant.findOne({ _id, userId })
        .lean()
        .then(restaurant => res.render('edit', { restaurant }))
        .catch(error => console.error(error))
})
// 提交修改的餐廳資訊
router.put('/:restaurant_id', (req, res) => {
    const newData = req.body
    newData.userId = req.user._id
    const _id = req.params.restaurant_id
    return Restaurant.findOne({ _id, userId: newData.userId })
        .then(restaurant => {
            restaurant = Object.assign(restaurant, newData)
            return restaurant.save()
        })
        .then(restaurant => res.redirect(`/restaurants/${_id}`))
        .catch(error => console.error(error))
})
// 刪除餐廳
router.delete('/:restaurant_id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.restaurant_id
    return Restaurant.findOne({ _id, userId })
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
})

module.exports = router