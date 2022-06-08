const Product = require('../models/product')

exports.searchFilters = async (req, res) => {
  try {
    let {
      searchText,
      price,
      selectedCategories,
      selectedSubs,
      star,
      selectedShipping,
      selectedBrand
    } = req.body
    let query = {}
    console.log('hey selected shippings are', selectedShipping)

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

    if (star > 0) {
      query = { ...query, averageRating: { $eq: star } }
    }

    if (selectedSubs.length > 0) {
      query = { ...query, subs: { $in: selectedSubs } }
    }

    if (selectedShipping) {
      query = { ...query, shipping: selectedShipping }
    }
    if (selectedBrand) {
      query = { ...query, brand: selectedBrand }
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
