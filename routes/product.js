const express = require("express");

const router = express.Router();

//middlwares

const { authCheck, adminCheck } = require("../middlewares/auth");

//controller
const {
  createProduct,
  readProduct,
  deleteProduct,
  updateProduct,
  listProducts,
  getProducts,
  productsCount,
  productStar,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, createProduct);
//we are usong count here to implement pagination and not to send all data at once

router.get("/products/total", productsCount);
router.get("/products/:count", listProducts);
router.get("/product/:slug", readProduct);
router.put("/product/:slug", authCheck, adminCheck, updateProduct);
router.delete("/product/:slug", authCheck, adminCheck, deleteProduct);
router.post("/products", getProducts);

//for rating
router.put("/product/star/:productId", authCheck, productStar);

module.exports = router;
