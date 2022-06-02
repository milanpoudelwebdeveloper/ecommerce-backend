const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  //text:true helps to search our database by title
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: [32, "Too long"],
      minlength: [2, "Too Short"],
      text: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [2000, "Too long"],
      text: true,
    },
    price: {
      type: Number,
      required: true,
      maxlength: [32, "Too long"],
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    // sub-categories can be many so it is array
    subs: [{ type: ObjectId, ref: "Sub" }],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      //enum here means it can  be yes or no can't be other than that
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: String,
      enum: ["Black", "Brown", "Silver", "White", "Blue"],
    },
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS", "Dell"],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
