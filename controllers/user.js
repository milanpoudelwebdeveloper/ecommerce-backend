const User = require('../models/user')

exports.addToWishList = async (req, res) => {
  const { productId } = req.body
  //we will find the user by email
  //in wishlist we don't want to duplicate the same products if the user adds the same item to the wislist
  //multiple times
  //we can use $addToSet which makes sure that we don't have duplicate wishlist items
  try {
    await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $addToSet: { wishlist: productId }
      }
    ).exec()
    res.status(200).send('Added to wishlist')
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .send('Something went wrong while adding the item to wishlist')
  }
}

exports.getAllWishLists = async (req, res) => {
  //here select selects one item that we specify and we get wishlist
  try {
    const allWishlists = await User.findOne({ email: req.user.email })
      .select('wishlist')
      .populate('wishlist')
      .exec()
    res.status(200).json(allWishlists)
  } catch (e) {
    console.log(e)
  }
}

exports.updateWishList = async (req, res) => {
  try {
    const { productId } = req.params
    //$pull pulls element from the array that is specified
    await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { wishlist: productId } }
    ).exec()
    res.status(200).send('Item deleted from your wishlist')
  } catch (e) {
    console.log(e)
  }
}
