import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: Boolean,
        required: true
    },
    orderTotalPrice: {
        type: Number,
        required: true
    },
    orderDate: {
        type: String,
        required: true
    },
    orderAddress: {
        type: String,
        required: true
    },
    orderTransport: {
        type: String,
        required: true
    },
    orderPayment: {
        type: String,
        required: true
    },
    orderItems: [{
        _id: Number,
        itemQuantity: Number,
        itemTotalPrice: Number,
        product_id: Number
    }]
})

export const Order = mongoose.model('order', orderSchema);