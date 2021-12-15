import { Account } from "../models/account.js"
import { v4 as uuidv4 } from 'uuid';
import createError from 'http-errors';

export const getAccounts = async (req, res) => {
    try{
        const accounts = await Account.find();
        res.status(200).json(accounts)
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const getAccountById = async (req, res) => {
    try{
        const { _id } = req.params;
        const account = await Account.findById(_id);

        if(account === null){
            res.status(404).json(account);
        }
        if(account){
            res.status(200).json(account);
        }
    }catch (err) {
        res.status(500);
    }
}

export const createAccount = async (req, res) => {
    try {
        const handle1 = typeof req.body._id === 'number' && typeof req.body.username === 'string';
        const handle2 = typeof req.body.password === 'string' && typeof req.body.type === 'string'
        const handle = handle1 && handle2;
        if(!handle){
            res.status(422).json()
        }if(handle){
            const account = await Account.create(req.body);
            res.status(200).json(account);
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const createManyAccount = async (req, res) => {
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
        const temp = await Account.findById(req.body._id);
        const handleNotFound1 = req.body._id == temp._id && req.body.username == temp.username;
        const handleNotFound2 = req.body.password != temp.password && req.body.type == temp.type;
        const handleNotFound = handleNotFound1 && handleNotFound2;
        if(!handleNotFound){
            res.status(422).json()
        }
        if(handleNotFound){
            const account = await Account.findByIdAndUpdate(updatePassword._id, updatePassword, {new: true});
            res.status(200).json(account)
        }
    } catch (err) {
        res.status(422).json({message: err});
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const { _id } = req.params;
        const account = await Account.findById(_id);

        if(account === null){
            res.status(404).json();
        }
        if(account){
            const accountDel = await Account.findByIdAndDelete(_id);
            res.status(204).json(accountDel);
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}