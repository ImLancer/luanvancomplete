import dotenv from 'dotenv';
dotenv.config();

//nhokshyn31
//shyn3101

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import accountRou from './routes/accountRou.js';
import accountTestRou from './routes/accountTestRou.js';
import userRou from './routes/userRou.js';
import productRou from './routes/productRou.js';
import orderRou from './routes/orderRou.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());

app.use('/account', accountRou);
app.use('/accountTest', accountTestRou);
app.use('/user', userRou);
app.use('/product', productRou);
app.use('/order', orderRou);

export default app;