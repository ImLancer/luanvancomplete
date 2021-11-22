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
        const product = await Product.findOne({_id: _id});
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const createProduct = async (req, res) => {
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
        const product = await Product.findByIdAndUpdate(updateProduct._id, updateProduct, {new: true});
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.params;
        const product = await Product.findByIdAndDelete(_id);
        res.status(204).json(product);
    } catch (err) {
        res.status(500).json({message: err});
    }
}