import express from 'express';
import { getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder } from '../controller/orderCon.js';

const router = express.Router();

router.get('/', getOrders);

router.get('/:_id', getOrderById);

router.post('/create', createOrder);

router.patch('/updateStatus', updateOrderStatus);

router.delete('/delete/:_id', deleteOrder);

export default router;