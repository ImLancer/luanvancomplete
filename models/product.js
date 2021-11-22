import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    prodName: {
        type: String,
        required: true,
    },
    prodNumber: {
        type: Number,
        required: true,
    },
    prodPrice: {
        type: Number,
        required: true,
    },
    prodSale: {
        type: Number,
        required: true,
    },
    prodImageUrl: {
        type: String,
        required: true
    },
    prodCategories:{
        type: [String],
        required: true
    },
    prodAuthor: {
        type: [String],
        required: true
    }
})

export const Product = mongoose.model('product', productSchema);