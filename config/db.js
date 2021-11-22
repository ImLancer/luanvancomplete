import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            UseUnifiedTopology: true
        });

        console.log('MongoDB was connected.');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
