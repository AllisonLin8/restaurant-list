// 載入express
const express = require('express')
// 設定參數
const app = express()
const port = 3002
// 載入express-handlebars
const exphbs = require('express-handlebars')
// 載入restaurant.json
const restaurantList = require('./restaurant.json')
// 定義要使用的樣板引擎
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
// 告訴 Express 要設定的 view engine 是 handlebars
app.set('view engine', 'handlebars')
// 告訴 Express 靜態檔案位於何處
app.use(express.static('public'))
// 設定路由
app.get('/', (req, res) => {
    res.render('index', { restaurants: restaurantList.results })
})
app.get('/restaurants/:restaurant_id', (req, res) => {
    const restaurant = restaurantList.results.find(restaurant => req.params.restaurant_id === restaurant.id.toString())
    res.render('show', { restaurant: restaurant })
})
app.get('/search', (req, res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantList.results.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase()))
    res.render('index', { restaurants: restaurants, keyword: keyword })
})
// 啟動伺服器
app.listen(port, () => {
    console.log(`This server is running on http://localhost:${port}`)
})