const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// ADMIN ROUTES - require admin role
router.route('/')
    .get(verifyToken, isAdmin, categoryController.getCategories)
    .post(verifyToken, isAdmin, upload.single("image"), categoryController.createCategory)

router.route('/:id')
    .patch(verifyToken, isAdmin, upload.single("image"), categoryController.patchCategory)
    .delete(verifyToken, isAdmin, categoryController.deleteCategory)

module.exports = router