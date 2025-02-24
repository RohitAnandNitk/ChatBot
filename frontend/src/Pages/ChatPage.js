import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css"; // Import the CSS file
import { googleLogout } from "@react-oauth/google";


const backendUrl = "https://chatbot-vg3m.onrender.com";
// const backendUrl = "http://localhost:3001";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const chatBoxRef = useRef(null); // Create a reference for the chat box

    // **Function to Fetch All Conversations for Current User**
    const fetchConversations = async () => {
        console.log("Fetching conversations from backend...");
        try {
            const response = await fetch(`${backendUrl}/conversation/fetch`, {
                method: "GET",
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch conversations");
            }
    
            const data = await response.json();
            console.log("API Response:", data.conversations[0].messages);
    
            // Ensure messages exist and are in the correct format
            if (Array.isArray(data.conversations[0].messages)) {
                setMessages(data.conversations[0].messages.map(msg => ({
                    text: msg.text,
                    sender: msg.sender
                })));
            } else {
                console.error("Unexpected response format:", data);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };
    
    
    

    // Fetch conversations when the component mounts
    useEffect(() => {
        fetchConversations();
    }, []);

    // Handle user sending a message
    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);

        // Save the user's message to the backend
        await fetch(`${backendUrl}/conversation/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ messages: [userMessage] }),
        });

        try {
            const botMessage = await getBotResponse(input);
            setMessages((prev) => [...prev, botMessage]);

            // Save the bot's response to the backend
            await fetch(`${backendUrl}/conversation/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ messages: [botMessage] }),
            });
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { text: "🤖 Sorry, an error occurred.", sender: "bot" },
            ]);
        }

        setInput("");
    };

    // Function to get bot response
    const getBotResponse = async (userInput) => {
        try {
            const response = await fetch(`${backendUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response from the server");
            }

            const data = await response.json();

            // Format response for better readability
            const formattedResponse = `
                Disease: ${data.disease}  
                Medicine: ${data.medicine}  
                Note: ${data.note}
                            `;

            return { text: `🤖 ${formattedResponse}`, sender: "bot" };
        } catch (error) {
            console.error("Error fetching bot response:", error);
            return { text: "🤖 Sorry, I'm unable to respond right now.", sender: "bot" };
        }
    };

    // Handle user logout
    const handleLogout = async () => {
        googleLogout();
        navigate("/");
    };

    // Auto-scroll to the bottom when messages change
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);
    
    const formatBotMessage = (text) => {
        // Match the structured response from AI
        const match = text.match(/Disease:\s*(.*)\s*Medicine:\s*(.*)\s*Note:\s*(.*)/);
    
        if (match) {
            return (
                <>
                    <strong>🤖 Disease:</strong> {match[1]} <br />
                    <strong>💊 Medicine:</strong> {match[2]} <br />
                    <strong>📌 Note:</strong> {match[3]}
                </>
            );
        }
    
        return text; // If format doesn't match, return as plain text
    };
     
    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1 className="chat-title">MediChat</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                        {msg.sender === "bot" ? formatBotMessage(msg.text) : msg.text}
                    </div>
                ))}
            </div>


            <div className="input-box">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()} // Send message on Enter
                    placeholder="Type a message..."
                    className="input"
                />
                <button onClick={handleSend}  className="send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
