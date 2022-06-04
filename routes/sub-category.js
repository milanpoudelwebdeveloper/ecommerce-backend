const express = require('express')

const router = express.Router()

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

//controllers

const {
  createSubCategory,
  readSubCategory,
  updateSubCategroy,
  deleteSubCategory,
  listSubSCategories
} = require('../controllers/sub-category')

//routes

router.post('/sub', authCheck, adminCheck, createSubCategory)
router.get('/subs', listSubSCategories)
router.get('/sub/:slug', readSubCategory)
router.put('/sub/:slug', authCheck, adminCheck, updateSubCategroy)
router.delete('/sub/:slug', authCheck, adminCheck, deleteSubCategory)

module.exports = router
