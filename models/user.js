const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const userSchema = new mongoose.Schema(
  {
    name: String,
    //index:true helps to find among database easier and efficiently
    email: {
      type: String,
      required: true,
      index: true
    },
    role: {
      type: String,
      default: 'subscriber'
    },
    cart: {
      type: Array,
      default: []
    },
    address: String,
    //here wishlist is an type array that has it's element that is reference to the product model
    wishlist: [{ type: ObjectId, ref: 'Product' }]
  },
  {
    timestamps: true
  }
)
module.exports = mongoose.model('User', userSchema)
