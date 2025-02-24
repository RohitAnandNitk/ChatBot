import { ChatGroq } from '@langchain/groq';

// Initialize the ChatGroq model
const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-8b-8192",
    temperature: 0.8,
    maxTokens: 200, // Increased for better responses
});


const formatAIResponse = (response) => {
    return `🤖 
Disease: ${response.disease || "Not provided"}  
Medicine: ${response.medicine || "Not provided"}  
Note: ${response.note || "Not provided"}`;
};


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

//router.post('/chat',
const  getResponse = async  (req, res) => {
    try {
        const userMessage = req.body.message;
        // console.log('User Message:', userMessage);

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
};



export default getResponse;
