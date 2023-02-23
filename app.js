// 載入express
const express = require('express')
// 設定參數
const app = express()
const port = 3000
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
// 載入 method-override
const methodOverride = require('method-override')
// 載入 routes
const routes = require('./routes')
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
// 設定 method-override
app.use(methodOverride('_method'))
// 設定路由
app.use(routes)
// 啟動伺服器
app.listen(port, () => {
    console.log(`This server is running on http://localhost:${port}`)
})