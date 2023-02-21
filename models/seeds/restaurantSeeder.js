// 載入mongoose
const mongoose = require('mongoose')
// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// 載入Restaurant
const Restaurant = require('../restaurant')
// 載入restaurantList
const restaurantList = require('../../restaurant.json')
// 資料庫連線並導入種子資料
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected.')
    for (let i = 0; i < restaurantList.results.length; i++) {
        Restaurant.create({
            name: restaurantList.results[i].name,
            name_en: restaurantList.results[i].name_en,
            category: restaurantList.results[i].category,
            image: restaurantList.results[i].image,
            location: restaurantList.results[i].location,
            phone: restaurantList.results[i].phone,
            google_map: restaurantList.results[i].google_map,
            rating: restaurantList.results[i].rating,
            description: restaurantList.results[i].description
        })
    }
    console.log('done.')
})