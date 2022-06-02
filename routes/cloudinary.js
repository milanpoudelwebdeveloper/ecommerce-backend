const express = require("express");

const router = express.Router();

const { authCheck, adminCheck } = require("../middlewares/auth");

const { uploadImages, deleteImage } = require("../controllers/cloudinary");

router.post("/uploadimages", authCheck, adminCheck, uploadImages);

//we are using post here instead of delete because we have to send imageId in body which is not accepted in the delete
router.post("/removeimage", authCheck, adminCheck, deleteImage);

module.exports = router;
