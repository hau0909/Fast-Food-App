const Order = require('../models/Order');

exports.getOrders = async(req, res) => {
    try{
        const orders = await Order.find();
        res.json(orders);
    } catch(error){
        res.status(500).json({ message: error.message});
    }
}

exports.updateOrder = async(req, res) =>{
    try{
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body},
            { new: true}
        );
        res.json(order);
    } catch(error){
        res.status(500).json({ message: error.message});
    }
}

exports.deleteOrder = async(req, res) => {
    try{
        const order = await Order.findByIdAndDelete(req.params.id);
        res.json(order);
    }catch(error){
        res.status(500).json({ message: error.message});
    }
}