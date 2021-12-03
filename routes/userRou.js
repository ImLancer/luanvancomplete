import express from 'express';
import { getUsers, getUserById, createUser, createManyUser, updateUser, deleteUser } from '../controller/userCon.js';

const router = express.Router();

router.get('/', getUsers);

router.get('/:_id', getUserById);

router.post('/create', createUser);

router.post('/createMany', createManyUser);

router.patch('/update', updateUser);

router.delete('/delete/:_id', deleteUser);

export default router;