// 載入Restaurant
const Restaurant = require('../restaurant')
// 載入restaurantList
const restaurantList = require('../../restaurant.json')
// 資料庫連線並導入種子資料
const db = require('../../config/mongoose')
db.once('open', () => {
    Restaurant.create(restaurantList.results)
    console.log('done.')
})