import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    born: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    }
})

export const User = mongoose.model('user', userSchema);