const Product = require('../models/product')

exports.searchFilters = async (req, res) => {
  try {
    let { searchText, price, selectedCategories, stars } = req.body
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

    if (stars) {
      //ratings in model product schema is array and we have to dig into the stars of the objects in the array
      //we need to form average rating from all array ratings of that product so we need to create one average rating
      //so we need to use $project aggregation //we use aggregation to add new average rating
      Product.aggregate([
        {
          //we need to generate a project based on the document and that document is
          // $$ROOT gives access to entire document
          $project: {
            document: '$$ROOT',
            floorAverage: {
              //floor gives 3.33 as 3 as an example
              //each ratings has star we want to get average value using $avg and apply floor
              $floor: { $avg: '$ratings.star' }
            }
          }
        },
        {
          //if the stars coming to backend, matches with the floorAverage that is generated then this is the product that we
          //are looking for
          $match: { floorAverage: stars }
        }
      ]).exec((err, aggregates) => {
        if (err) {
          console.log('Error on aggregation', err)
        }
        Product.find({ _id: aggregates })
          .populate('categories')
          .populate('subs')
          .exec((err, products) => {
            if (err) {
              console.log('Product error finding after aggregate', err)
            }
            console.log(products)
          })
      })

      //now after new floorAverage, we
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
