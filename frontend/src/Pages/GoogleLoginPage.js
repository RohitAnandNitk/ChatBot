
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import "./GoogleLoginPage.css"; // Import the CSS file
import {jwtDecode} from 'jwt-decode';

const backendUrl = "https://chatbot-vg3m.onrender.com";
// const backendUrl = "http://localhost:3001";

const GoogleLoginPage = () => {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const userInfo = {
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
        };

        const response = await fetch(`${backendUrl}/user/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(userInfo),
        });

        if (response.ok) {
            console.log("Logged in successfully");
            navigate("/chat-page");
        } else {
            console.log("Login failed");
        }
    };

    const handleError = () => {
        console.error("Error during login");
    };

    return (
        <div className="homepage-container">
            <header className="homepage-header">
                <h1 className="title">Welcome to <span className="highlight">MediChat</span>!</h1>
                <p className="homepage-description">
                    MediChat is your personalized healthcare assistant, here to provide accurate 
                    medical guidance and support. Chat with us for reliable health tips, 
                    medication advice, and more — all in one place.<br /> Your Health, Our Priority!
                </p>
            </header>
            <div className="homepage-actions">
                <GoogleOAuthProvider clientId="206553926368-8cfbdufn01frh7hpaol33704ig4q4va9.apps.googleusercontent.com">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        shape="pill"
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default GoogleLoginPage;
