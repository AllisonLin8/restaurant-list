const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 瀏覽全部餐廳的頁面
router.get('/', (req, res) => {
    const userId = req.user._id
    Restaurant.find({ userId })
        .lean()
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error))
})
// 搜尋餐廳 & 排序餐廳
router.get('/search', (req, res) => {
    const userId = req.user._id
    const keyword = req.query.keyword
    const sortBy = req.query.sortBy
    let sortMethod = {}
    if (sortBy) { // 轉換sortMethod
        switch (sortBy) {
            case 'nameAsc':
                sortMethod = { name: 'asc' }
                break
            case 'nameDesc':
                sortMethod = { name: 'desc' }
                break
            case 'categoryAsc':
                sortMethod = { category: 'asc' }
                break
            case 'locationAsc':
                sortMethod = { location: 'asc' }
                break
            case 'ratingAsc':
                sortMethod = { rating: 'desc' }
                break
        }
    }
    Restaurant.find({ userId })
        .lean()
        .then(restaurants => {
            let restaurantFiltered = restaurants
            if (keyword) { // keyword
                restaurantFiltered = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase()))
            }
            if (sortMethod) { // sort
                restaurantFiltered.sort((a, b) => {
                    const key = Object.keys(sortMethod)[0]
                    const [propA, propB] = [a[key], b[key]]
                    if (propA < propB) {
                        return sortMethod[Object.keys(sortMethod)[0]] === 'asc' ? -1 : 1
                    }
                    if (propA > propB) {
                        return sortMethod[Object.keys(sortMethod)[0]] === 'asc' ? 1 : -1
                    }
                    return 0
                })
            }
            res.render('index', { keyword, restaurants: restaurantFiltered })
        })
        .catch(error => console.error(error))
})

module.exports = router