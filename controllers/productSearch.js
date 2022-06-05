const Product = require('../models/product')

exports.searchFilters = async (req, res) => {
  try {
    let { searchText, price } = req.body
    let query = {}

    if (searchText) {
      //full text search
      query = { ...query, $text: { $search: searchText } }
    }

    if (price) {
      price = {
        $gte: price[0],
        $lte: price[1]
      }
      query = { ...query, price: price }
    }

    const products = await Product.find({ ...query })
      .populate('category')
      .populate('subs')
      .exec()
    res.json(products)
  } catch (e) {
    console.log(e)
  }
}
