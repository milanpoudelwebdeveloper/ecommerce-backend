const express = require("express");
const router = express.Router();

//import controllers

const { createOrUpdateUser, getCurrentUser } = require("../controllers/auth");
const { authCheck, adminCheck } = require("../middlewares/auth");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, getCurrentUser);
router.post("/current-admin", authCheck, adminCheck, getCurrentUser);

module.exports = router;
