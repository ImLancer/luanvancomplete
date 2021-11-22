import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controller/productCon.js';

const router = express.Router();

router.get('/', getProducts )

router.get('/:_id', getProductById )

router.post('/create', createProduct)

router.patch('/update', updateProduct)

router.delete('/delete/:_id', deleteProduct)

export default router;