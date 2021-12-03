import { Product } from "../models/product.js";
import { v4 as uuidv4 } from 'uuid';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const getProductById = async (req, res) => {
    try {
        const { _id } = req.params;
        const product = await Product.findById(_id);
        if(product === null){
            res.status(404).json();
        }
        if(product){
            res.status(200).json(product);
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const createProduct = async (req, res) => {
    try {
        const newProducts = req.body;
        const products = await Product.create(newProducts);
        res.status(200).json(products);
    } catch (err) {
        res.status(422).json({message: 'Validation Error'});
    }
}

export const createManyProduct = async (req, res) => {
    try {
        const newProducts = req.body;
        const products = await Product.insertMany(newProducts);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const updateProduct = async (req, res) => {
    try {
        const updateProduct = req.body;
        const handle = typeof req.body._id === 'number' && typeof req.body.prodName === 'string' && typeof req.body.prodNumber === 'number' && typeof req.body.prodPrice === 'number' && typeof req.body.prodSale === 'number' && typeof req.body.prodImageUrl === 'string' && typeof req.body.prodCategories === 'object' && typeof req.body.prodAuthor === 'object';

        if(!handle){
            res.status(422).json()
        }
        if(handle){
            const product = await Product.findByIdAndUpdate(updateProduct._id, updateProduct, {new: true});
            res.status(200).json(product)
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.params;
        const product = await Product.findById(_id);

        if(product === null){
            res.status(404).json();
        }
        if(product){
            const product = await Product.findByIdAndDelete(_id);
            res.status(204).json(product);
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}