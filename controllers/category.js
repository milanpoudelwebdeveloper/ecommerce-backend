const Category = require('../models/category')

const Sub = require('../models/sub-category')
const slugify = require('slugify')

const Product = require('../models/product')

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body
    const categoryExists = await Category.findOne({ name: name }).exec()
    if (categoryExists) {
      res
        .status(400)
        .send('Category with this name exists.Please try another name')
      return
    }
    const category = await new Category({
      name: name,
      slug: slugify(name)
    }).save()
    console.log(category)
    res.status(200).send('Category successfully created')
  } catch (e) {
    console.log(e)
    res.status(400).send('Create category failed')
  }
}

exports.listCategories = async (req, res) => {
  try {
    //we don't pass anytning in find because we want to get all categories and sort all categories by date
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec()
    res.status(200).json(categories)
  } catch (e) {
    console.log(e)
    res
      .status(400)
      .send('Something went wrong while trying to fetch categories')
  }
}

//get single category
exports.readCategory = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec()
    //we are going to send both category and products here

    const allProducts = await Product.find({ category })
      .populate('category')
      .exec()
    res.status(200).json({
      category,
      allProducts
    })
  } catch (e) {
    console.log(e)
    res.status(400).send('Something went wrong while trying to read category')
  }
}

exports.updateCategory = async (req, res) => {
  const { name } = req.body
  //we will update name and slug both
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name: name,
        slug: slugify(name)
      },
      { new: true }
    )
    console.log(updated)
    res.status(200).send('Successfully updated the category')
  } catch (e) {
    console.log(e)
    res.status(400).send('Category update failed')
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findOneAndDelete({ slug: req.params.slug })
    res.status(200).send('Category deleted successfully')
  } catch (e) {
    console.log(e)
    res.status(400).send('Delete category failed')
  }
}

//trying to find all subcategories here because each sub has parent category
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await Sub.find({ parent: req.params.id })
    res.status(200).json(subCategories)
  } catch (e) {
    console.log(e)
    res.status(400).send(e.message)
  }
}
