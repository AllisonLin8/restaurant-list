// 載入express
const express = require('express')
// 設定參數
const app = express()
const port = 3002
// 載入express-handlebars
const exphbs = require('express-handlebars')
// 載入mongoose
const mongoose = require('mongoose')
// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// 載入body-parser
const bodyParser = require('body-parser')
// 載入 Restaurant
const Restaurant = require('./models/restaurant')
const { urlencoded } = require('express')
// 設定資料庫
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected.')
})
// 定義要使用的樣板引擎
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
// 告訴 Express 要設定的 view engine 是 handlebars
app.set('view engine', 'handlebars')
// 告訴 Express 靜態檔案位於何處
app.use(express.static('public'))
// 設定body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// 設定路由
// 1. 瀏覽全部餐廳的頁面
app.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error))
})
// 2. 瀏覽新增餐廳的頁面
app.get('/restaurants/new', (req, res) => {
    res.render('new')
})
// 3. 提交新的餐廳資料
app.post('/restaurants', (req, res) => {
    const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
    return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
        .then(() => res.redirect('/'))
        .catch(error => console.error(error))
})
// 3. 瀏覽餐廳資訊的頁面
app.get('/restaurants/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id
    return Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render('show', { restaurant }))
        .catch(error => console.error(error))
})
// 4. 搜尋餐廳
app.get('/search', (req, res) => {
    const keyword = req.query.keyword
    return Restaurant.find()
        .lean()
        .then(restaurants => {
            const restaurantFiltered = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase()))
            res.render('index', { restaurants: restaurantFiltered, keyword })
        })
        .catch(error => console.error(error))
})
// 啟動伺服器
app.listen(port, () => {
    console.log(`This server is running on http://localhost:${port}`)
})