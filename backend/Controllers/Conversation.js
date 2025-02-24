import Conversation from '../Models/conversationSchema.js';
import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken"; // Ensure jwt is imported

export const saveConversation = async (req, res) => {
    console.log("call for save the message .......");
    
    console.log("Cookies received:", req.cookies); // Log cookies received by the server
    
    const { messages } = req.body;

    console.log("message : " , messages);
    const token = req.cookies.authToken; // Access the authToken cookie

    console.log(" extract token :" , token);

    if (!token) {
        return res.status(401).send({ success: false, message: "Unauthorized" });
    }
  
    console.log(" auth token :" , token);

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;

        console.log("userId:", userId);
        console.log("Messages:", messages);

        if (!userId || !messages || !Array.isArray(messages)) {
            return res.status(400).send({ success: false, message: "Invalid input data." });
        }

        let conversation = await Conversation.findOne({user : userId });

        if (!conversation) {
            // Create a new conversation if none exists
            conversation = new Conversation({ user : userId, messages: [] });
        }

        // Append messages (user's message and bot's response)
        conversation.messages.push(...messages);
        await conversation.save();

        console.log("call end  for save the message .......");

        res.status(200).send({ success: true, message: "Conversation saved successfully." });
    } catch (error) {
        console.error("Error saving conversation:", error);
        res.status(500).send({ success: false, error: "Failed to save conversation." });
    }
};

export const getConversations  =  async (req, res) => {
    console.log("enter in the get conversations function........");
    console.log("Cookies received:", req.cookies); // Log cookies received by the server
    try {
        console.log("Fetching conversations for user:", req.user); // Debugging

        if (!req.user || !req.user.userId) {
            return res.status(400).json({ success: false, msg: "Invalid token or user not authenticated" });
        }

        const userId = req.user.userId;
        console.log("Userid is :", userId);
        const conversations = await Conversation.find({ user: userId });

        return res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return res.status(500).json({ success: false, msg: "Server error, please try again later" });
    }
};
