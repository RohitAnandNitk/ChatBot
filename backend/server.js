import { ChatGroq } from '@langchain/groq';
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const port = 3001;

const app = express();
import cors from 'cors';
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body

// Initialize the ChatGroq model
const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-70b-versatile",
    temperature: 0.8,
    maxTokens: 200, // Increased for better responses
});

// Define the schema using zod
import { z } from 'zod';
const MedicineRecommendation = z.object({
    disease: z.string().optional().describe("The name of the disease or symptom."),
    medicine: z.string().optional().describe("The recommended over-the-counter medicine."),
    note: z.string().optional().describe("Additional advice or cautionary note."),
}).describe("A recommendation for medicine based on a disease or symptom.");

// Bind the schema to the model
const structuredLlm = llm.withStructuredOutput(MedicineRecommendation, { name: "MedicineRecommendation" });

// Define the personality prompt
const prompt = `
You are a helpful assistant that provides over-the-counter medicine recommendations based on common diseases or symptoms.
Your response must be structured in this format:
{
  "disease": "<Name of the disease>",
  "medicine": "<Recommended over-the-counter medicine>",
  "note": "<Additional advice or cautionary note>"
}
Always include a note advising the user to consult a doctor for serious conditions.
`;

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log('User Message:', userMessage);

        // Call the model with the structured schema
        const responseMessage = await structuredLlm.invoke(`${prompt}\nUser: ${userMessage}`);

        if (responseMessage) {
            // console.log('AI Response:', responseMessage);
            // Extract fields from the structured response
            const { disease, medicine, note } = responseMessage;

            // Send a structured response back to the frontend
            res.json({ disease, medicine, note });
        } else {
            res.status(400).json({ message: 'No response from the model.' });
        }
    } catch (error) {
        console.error('Schema Validation or API Error:', error);
        res.status(500).json({ 
            message: 'Error generating AI response.', 
            error: error.message 
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
