import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

export const Account = mongoose.model('account', accountSchema);