import express from 'express';
import { getAccounts, getAccountById, createAccount, updatePassword, deleteAccount } from '../controller/accountCon.js';

const router = express.Router();

router.get('/', getAccounts )

router.get('/:_id', getAccountById )

router.post('/create', createAccount)

router.patch('/update', updatePassword)

router.delete('/delete/:_id', deleteAccount)

export default router;