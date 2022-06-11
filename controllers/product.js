const Product = require('../models/product')
const User = require('../models/user')
const slugify = require('slugify')

exports.createProduct = async (req, res) => {
  try {
    //since we are creating slug by ourself from controller, so we are attaching it to req.body so we don't
    //have to send all individual one by one, we have lots of fields coming like price, quantity and lots of
    //so saving req.body is easier
    req.body.slug = slugify(req.body.title)
    const product = await new Product(req.body).save()
    console.log(product)
    res.status(200).send('Successfully created the product')
  } catch (e) {
    console.log(e)
    res.status(400).send(e.message)
  }
}

exports.listProducts = async (req, res) => {
  try {
    let products = await Product.find({})
      //just to convert it into integer we use parseInt
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subs')
      //we can also pass array in sort
      .sort([['createdAt', 'desc']])
      .exec()
    //before we send , we are apply limit and we will populate category and subcategory before sending

    res.status(200).json(products)
  } catch (e) {
    console.log(e)
    res.status(400).send(e.message)
  }
}

//get single product
exports.readProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('subs')
      .exec()

    res.status(200).json(product)
  } catch (e) {
    console.log(e)
    res
      .status(400)
      .send('Something went wrong while fetching product information')
  }
}

exports.updateProduct = async (req, res) => {
  try {
    //when we update the title, slug will also update
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true
      }
    ).exec()
    res.status(200).json(updated)
  } catch (e) {
    console.log('Product update failed', e)
    res.status(400).send('Product update failed')
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({
      slug: req.params.slug
    }).exec()
    res.status(200).send('Product deleted successfully')
  } catch (e) {
    console.log(e)
    res.status(400).send('Something went wrong while deleting product')
  }
}

//without pagination
// exports.getProducts = async (req, res) => {
//   try {
//     //here order is either descending or ascending
//     //here sort can be updatedAt/createdAt
//     //limit can be any number
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();
//     res.status(200).json(products);
//   } catch (e) {
//     console.log(e);
//     res.status(400).send("Something went wrong");
//   }
// };

//with pagination
exports.getProducts = async (req, res) => {
  try {
    const { sort, order, page } = req.body
    const currentPage = page || 1
    //in per page how many products we are going to send
    const productsPerPage = 3
    //here skips skips all the products
    //for example if skip(3) then it means it skips the first 3 products

    const products = await Product.find({})
      .skip((currentPage - 1) * productsPerPage)
      .populate('category')
      .populate('subs')
      .sort([[sort, order]])
      .limit(productsPerPage)
      .exec()
    res.status(200).json(products)
  } catch (e) {
    console.log(e)
  }
}
//getting the total counts of products in the database
exports.productsCount = async (req, res) => {
  try {
    let total = await Product.find({}).estimatedDocumentCount().exec()
    res.status(200).json(total)
  } catch (e) {
    console.log(e)
  }
}

const updateAverageStarRatings = (productId) => {
  Product.updateOne({ _id: productId }, [
    {
      $addFields: {
        averageRating: {
          $floor: { $avg: '$ratings.star' }
        }
      }
    }
  ]).exec((error, result) => {
    if (error) {
      console.log('Error updating fields', error)
    }
    console.log(result, 'Succcessfully updated')
  })
}

exports.productStar = async (req, res) => {
  //first we find product and also use who gave stars
  const product = await Product.findOne({ _id: req.params.productId }).exec()
  //we get req.user from authCheck middleware
  const user = await User.findOne({ email: req.user.email }).exec()

  //if currently logged in user have already gave ratings then we will update otherwise
  //we will add new rating to the array

  const { star } = req.body

  //we can use find methods in the array (i.e product.ratings) to check if current user has already given ratings
  let exisitingRatingObject = product.ratings.find(
    (r) => r.postedBy.toString() === user._id.toString()
  )

  console.log('user gave rating', exisitingRatingObject)

  //if user hasn't given rating then we will push the rating to the rating array
  if (exisitingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        //pushing to the ratings array
        $push: {
          ratings: {
            star: star,
            postedBy: user._id
          }
        }
      },
      {
        new: true
      }
    ).exec()
    updateAverageStarRatings(product._id)
    console.log('rating is', ratingAdded)
    res.status(200).send('Thank you for your review')
  } else {
    //if users want to update rating means if they give ratings again
    const ratingUpdated = await Product.updateOne(
      {
        //here we are searching for object/elemet in ratings array that matches with the exisitingRatingObject
        ratings: { $elemMatch: exisitingRatingObject }
      },
      {
        //we only need to update star a nd not touch postedBy or anything
        //so we use special syntax $ to access it
        $set: { 'ratings.$.star': star }
      },
      {
        new: true
      }
    ).exec()
    updateAverageStarRatings(product._id)
    console.log('Updated star rating is', ratingUpdated)
    res.status(200).json(ratingUpdated)
  }
}

//this handlequery is function that handles searches whether it's a different filter or by any keywords

// const handleQuery = async (req, res, query) => {
//   console.log(req)
//   //we have added text:true fields in title and description of product model
//   //that's why we can query with the text that we sent
//   const products = await Product.find({ $text: { $search: query }, price: {} }) //this is text based search
//     .populate('category')
//     .populate('subs')
//     .exec()
//   res.json(products)
// }

// const handlePrice = async (req, res, price) => {
//   //here $gte means greater
//   //here we are passing price that is array from frontend
//   try {
//     let products = await Product.find({
//       price: {
//         $gte: price[0],
//         $lte: price[1]
//       }
//     })
//       .populate('category')
//       .populate('subs')
//       .exec()
//     res.status(200).json(products)
//   } catch (e) {
//     console.log(e)
//   }
// }

// exports.searchFilters = async (req, res) => {
//   const { query, price } = req.body
//   if (query) {
//     await handleQuery(req, res, query)
//   }
//   //price will be in the range for eg. [10,50]
//   if (price !== undefined) {
//     await handlePrice(req, res, price)
//   }
// }
