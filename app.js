// 載入express
const express = require('express')
// 設定參數
const app = express()
const port = 3000
require('./config/mongoose')
// 載入express-handlebars
const exphbs = require('express-handlebars')
// 載入body-parser
const bodyParser = require('body-parser')
// 載入 method-override
const methodOverride = require('method-override')
// 載入 routes
const routes = require('./routes')
const { urlencoded } = require('express')
// 定義要使用的樣板引擎
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
// 告訴 Express 要設定的 view engine 是 handlebars
app.set('view engine', 'handlebars')
// 告訴 Express 靜態檔案位於何處
app.use(express.static('public'))
// 設定body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// 設定 method-override
app.use(methodOverride('_method'))
// 設定路由
app.use(routes)
// 啟動伺服器
app.listen(port, () => {
    console.log(`This server is running on http://localhost:${port}`)
})