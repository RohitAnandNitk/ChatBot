import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./Config/db.js"; // Database connection

dotenv.config();

const port = 3001;
const app = express();

// ✅ Fix: CORS should explicitly allow Authorization header
const corsOptions = {
    origin: ["http://localhost:3000", "https://chat-bot-sigma-vert.vercel.app"],
    methods: "GET, POST, PUT, DELETE",
    credentials: true, // ✅ Allows cookies to be sent with requests
    allowedHeaders: "Content-Type, Authorization", // ✅ Allow Authorization header
};

app.use(cors(corsOptions));

// ✅ Fix: Ensure `cookieParser` comes before `express.json()`
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON request body

// Import routes
import AiRoutes from "./Routes/AiRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import ConversationRoutes from "./Routes/ConversationRoutes.js";

// Use routes
app.use("/", AiRoutes);
app.use("/user", UserRoutes);
app.use("/conversation", ConversationRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
