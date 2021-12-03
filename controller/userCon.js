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
        const user = await User.findById(_id);
        if(user === null){
            res.status(404).json();
        }
        if(user){
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const createUser = async (req, res) => {
    try {
        const newUsers = req.body;
        const user = await User.create(newUsers);
        res.status(200).json(user);
    } catch (err) {
        res.status(422).json({message: 'Validation Error'});
    }
}

export const createManyUser = async (req, res) => {
    try {
        const newUsers = req.body;
        const users = await User.insertMany(newUsers);
        res.status(200).json(users);
    } catch (err) {
        res.status(422).json({message: 'Validation Error'});
    }
}

export const updateUser = async (req, res) => {
    try {
        const updateUser = req.body;
        const handle = typeof req.body._id === 'number' && typeof req.body.name === 'string' && typeof req.body.born === 'number' && typeof req.body.sex === 'string' && typeof req.body.address === 'string' && typeof req.body.phone === 'string' && typeof req.body.account === 'string';

        if(!handle){
            res.status(422).json()
        }
        if(handle){
            const user = await User.findByIdAndUpdate(updateUser._id, updateUser, {new: true});
            res.status(200).json(user)
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { _id } = req.params;
        const user = await User.findById(_id);

        if(user === null){
            res.status(404).json();
        }
        if(user){
            const userDel = await User.findByIdAndDelete(_id);
            res.status(204).json(userDel);
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}