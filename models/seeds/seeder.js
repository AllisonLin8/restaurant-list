const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('../../restaurant.json').results
const db = require('../../config/mongoose')
const SEED_USER = [{ email: 'user1@example.com', password: '12345678' }, { email: 'user2@example.com', password: '12345678' }]

db.once('open', async () => {
    try {
        // 建立使用者
        for (let i = 0; i < SEED_USER.length; i++) {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(SEED_USER[i].password, salt)
            const user = await User.create({
                email: SEED_USER[i].email,
                password: hash
            })
            // 分配餐廳給使用者
            const startIndex = i * 3
            const endIndex = startIndex + 3
            const slicedRestaurants = restaurantList.slice(startIndex, endIndex)
            for (const restaurant of slicedRestaurants) {
                restaurant.userId = user._id
                await Restaurant.create(restaurant)
            }
        }
        console.log('done.')
        process.exit()
    } catch (err) {
        console.error(err)
        process.exit()
    }
})