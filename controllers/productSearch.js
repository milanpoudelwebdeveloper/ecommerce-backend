const Product = require('../models/product')

exports.searchFilters = async (req, res) => {
  try {
    let { searchText, price, selectedCategories } = req.body
    console.log('check the filters', searchText, selectedCategories)
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

    if (selectedCategories.length > 0) {
      query = { ...query, category: [...selectedCategories] }
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
