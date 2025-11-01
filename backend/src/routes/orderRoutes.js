const express = require('express')
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/auth');

router.route('/')
    .get(verifyToken, orderController.getOrders)

router.route('/:id')
    .patch(verifyToken, orderController.updateOrder)
    .delete(verifyToken, orderController.deleteOrder)

module.exports=router;