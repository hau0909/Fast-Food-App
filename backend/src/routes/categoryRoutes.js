const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.route('/')
    .get(verifyToken, categoryController.getCategories)
    .post(verifyToken, upload.single("image"), categoryController.createCategory)

router.route('/:id')
    .patch(verifyToken, upload.single("image"), categoryController.patchCategory)
    .delete(verifyToken, categoryController.deleteCategory)

module.exports = router