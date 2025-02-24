import express from 'express';
const router = express.Router();

import {jwtAuthMiddleware} from '../Middleware/jwt.js'
import {saveConversation , getConversations} from '../Controllers/Conversation.js'

router.post("/save",saveConversation);
router.get("/fetch", jwtAuthMiddleware , getConversations);


export default router;
