import express from 'express';
const router = express.Router();

import {newUser , logout } from '../Controllers/User.js';

router.post('/add' , newUser);

router.post('/logout', logout);

export default router;
