const { default: slugify } = require("slugify");
const SubCategory = require("../models/sub-category");
const Product = require("../models/product");

exports.createSubCategory = async (req, res) => {
  try {
    console.log(req.body);
    const { name, parent } = req.body;

    const subExists = await SubCategory.findOne({
      name: name,
    }).exec();
    if (subExists) {
      res.status(400).send("Sub-Category with this name exists.");
      return;
    }
    const subCategory = await new SubCategory({
      name: name,
      slug: slugify(name),
      parent: parent,
    }).save();
    res
      .status(200)
      .send(`SubCategory-${subCategory.name} successfully created `);
  } catch (e) {
    console.log(e);
    res.status(400).send("Sub-category create failed.Try Again");
  }
};
exports.listSubSCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({})
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(subCategories);
  } catch (e) {
    console.log(e);
    res.status(400).send("Fetching sub-categories failed");
  }
};
exports.readSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findOne({
      slug: req.params.slug,
    }).exec();
    //send both sub-category and product
    const allSubProducts = await Product.find({ subs: subCategory })
      .populate("category")
      .populate("subs")
      .exec();
    res.status(200).json({
      subCategory,
      allSubProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(`Can't get info of sub-category ${req.params.slug}`);
  }
};
exports.updateSubCategroy = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const subCategory = await SubCategory.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name: name,
        slug: slugify(name),
        parent: parent,
      },
      {
        new: true,
      }
    );
    res.status(200).send("Sub-Category successfullly updated");
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong while trying to update");
  }
};
exports.deleteSubCategory = async (req, res) => {
  try {
    const deleted = await SubCategory.findOneAndDelete({
      slug: req.params.slug,
    }).exec();
    res
      .status(200)
      .send(`${req.params.slug} sub-category deleted successfully`);
  } catch (e) {
    console.log(e);
    res
      .status(400)
      .send("Something went wrong while trying to delete the sub-category");
  }
};
