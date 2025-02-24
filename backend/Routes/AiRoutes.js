import express from 'express';
const router = express.Router();

import getResponse from '../Controllers/AI.js';

router.post('/chat' , getResponse);

export default router;

