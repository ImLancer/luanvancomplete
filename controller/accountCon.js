import { Account } from "../models/account.js"
import { v4 as uuidv4 } from 'uuid';

export const getAccounts = async (req, res) => {
    try{
        const accounts = await Account.find();
        res.status(200).json(accounts)
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const getAccountById = async (req, res) => {
    try {
        const { _id } = req.params;
        const account = await Account.findOne({_id: _id});
        res.status(200).json(account);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const createAccount = async (req, res) => {
    try {
        const newAccounts = req.body;
        const accounts = await Account.insertMany(newAccounts);
        res.status(200).json(accounts);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const updatePassword = async (req, res) => {
    try {
        const updatePassword = req.body;
        const account = await Account.findByIdAndUpdate(updatePassword._id, updatePassword, {new: true});
        res.status(200).json(account)
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const { _id } = req.params;
        const account = await Account.findByIdAndDelete(_id);
        res.status(204).json(account);
    } catch (err) {
        res.status(500).json({message: err});
    }
}