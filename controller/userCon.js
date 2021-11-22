import { User } from "../models/user.js";
import { v4 as uuidv4 } from 'uuid';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const getUserById = async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await User.findOne({_id: _id});
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const createUser = async (req, res) => {
    try {
        const newUsers = req.body;
        const users = await User.insertMany(newUsers);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const updateUser = async (req, res) => {
    try {
        const updateUser = req.body;
        const user = await User.findByIdAndUpdate(updateUser._id, updateUser, {new: true});
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await User.findByIdAndDelete(_id);
        res.status(204).json(user);
    } catch (err) {
        res.status(500).json({message: err});
    }
}