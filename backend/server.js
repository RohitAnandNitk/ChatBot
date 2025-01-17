const express = require('express');
const fetch = require('node-fetch'); // Import node-fetch
const dotenv = require('dotenv'); // Import dotenv for environment variables
const Groq = require('groq-sdk'); // Import Groq SDK

dotenv.config(); // Load environment variables from .env

const port = 3001;
const app = express();


const cors = require('cors');
app.use(cors());


// Middleware to parse JSON request body
app.use(express.json());

// Initialize Groq SDK
const groq = new Groq({ apiKey: process.env.API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log('User Message:', userMessage);

        // Send request to Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: userMessage,
                },
            ],
            model: 'llama-3.1-70b-versatile',
        });

        // Extract the chatbot's response
        const responseMessage =
            chatCompletion.choices?.[0]?.message?.content || 'No response from chatbot';

        // Send the chatbot's response back to the frontend
        res.json({ message: responseMessage });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error generating AI response' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
