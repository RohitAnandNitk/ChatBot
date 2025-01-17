import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatPage.css"; // Import the CSS file
import { googleLogout } from "@react-oauth/google";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const botMessage = await getBotResponse(input);
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { text: "Bot: Sorry, an error occurred.", sender: "bot" },
            ]);
        }

        setInput("");
    };

    const getBotResponse = async (userInput) => {
        try {
            const response = await fetch("http://localhost:3001/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userInput }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response from the server");
            }

            const data = await response.json();
            return { text: `Bot: ${data.message}`, sender: "bot" };
        } catch (error) {
            console.error("Error fetching bot response:", error);
            return { text: "Bot: Sorry, I'm unable to respond right now.", sender: "bot" };
        }
    };

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem("google_token"); // Clear token from storage
        navigate("/");
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1 className="chat-title">ChatBot</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={
                            msg.sender === "user" ? "user-message" : "bot-message"
                        }
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="input-box">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="input"
                />
                <button onClick={handleSend} className="send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
