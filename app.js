// 載入套件
const express = require('express')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')

require('./config/mongoose')
const routes = require('./routes')
// 設定參數
const app = express()
const port = 3000
const { urlencoded } = require('express')

// 定義要使用的樣板引擎
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
// 告訴Express要設定的view engine是handlebars
app.set('view engine', 'handlebars')
// 告訴Express靜態檔案位於何處
app.use(express.static('public'))
// 設定session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
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