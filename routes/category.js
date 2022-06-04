const express = require('express')

const router = express.Router()

//middlwares

const { authCheck, adminCheck } = require('../middlewares/auth')

//controller
const {
  createCategory,
  readCategory,
  deleteCategory,
  updateCategory,
  listCategories,
  getSubCategories
} = require('../controllers/category')

router.post('/category', authCheck, adminCheck, createCategory)
router.get('/categories', listCategories)
router.get('/category/:slug', readCategory)
router.put('/category/:slug', authCheck, adminCheck, updateCategory)
router.delete('/category/:slug', authCheck, adminCheck, deleteCategory)

//in this route we are tying to fetch subcategories  based on the category or category id
router.get('/category/subs/:id', getSubCategories)

module.exports = router
