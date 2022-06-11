const express = require('express')
const router = express.Router()

const { authCheck } = require('../middlewares/auth')

const {
  addToWishList,
  getAllWishLists,
  updateWishList
} = require('../controllers/user')

router.post('/user/wishlist', authCheck, addToWishList)

router.get('/user/wishlist', authCheck, getAllWishLists)

router.put('/user/wishlist/:productId', authCheck, updateWishList)

module.exports = router
