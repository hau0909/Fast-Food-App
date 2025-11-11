const express = require('express')
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// ADMIN ROUTES - require admin role
router.route('/')
    .get(verifyToken, isAdmin, orderController.getOrders)

router.route('/:id')
    .patch(verifyToken, isAdmin, orderController.updateOrder)
    .delete(verifyToken, isAdmin, orderController.deleteOrder)

module.exports=router;