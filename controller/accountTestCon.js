import { Account } from "../models/account.js"

export const getAccounts = async (req, res) => {
    try{
        const accounts = await Account.find();
        res.status(200).json(accounts)
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const getAccountById = async (req, res) => {

}

export const createAccount = async (req, res) => {

}

export const updatePassword = async (req, res) => {

}

export const deleteAccount = async (req, res) => {

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