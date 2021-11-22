import { Order } from "../models/order.js";
import { v4 as uuidv4 } from 'uuid';

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { _id } = req.params;
        const order = await Order.findOne({_id: _id});
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const createOrder = async (req, res) => {
    try {
        const newOrders = req.body;
        const orders = await Order.insertMany(newOrders);
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const updateOrder = req.body;
        const order = await Order.findByIdAndUpdate(updateOrder._id, {orderStatus: updateOrder.orderStatus}, {new: true});
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const { _id } = req.params;
        const order = await Order.findByIdAndDelete(_id);
        res.status(204).json(order);
    } catch (err) {
        res.status(500).json({message: err});
    }
}