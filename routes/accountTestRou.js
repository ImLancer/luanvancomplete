import express from 'express';
import { getAccounts, getAccountById, createAccount, createManyAccount, updatePassword, deleteAccount } from '../controller/accountTestCon.js';

const router = express.Router();

router.get('/', getAccounts )

router.get('/:_id', getAccountById )

router.post('/create', createAccount)

router.post('/createMany', createManyAccount)

router.patch('/update', updatePassword)

router.delete('/delete/:_id', deleteAccount)

export default router;