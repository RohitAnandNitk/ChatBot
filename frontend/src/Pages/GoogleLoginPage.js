import React from 'react'
// google console provide login oath
import { GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import "./GoogleLoginPage.css"; // Import the CSS file



const  GoogleLoginPage = () => {
   
  const navigate = useNavigate();

  const handleSucess = (credentialResponse) =>{
      console.log("login sucessfully with " ,credentialResponse );
      localStorage.setItem("google_token", credentialResponse.credential); // Save token locally
      navigate("/chat-page");
  }
  const handleError = () =>{
     console.log("Error during login");
  }




  return (
    <div>
        <div className="homepage-container">
            <header className="homepage-header">
                <h1>Welcome to ChatBot</h1>
                <p className="homepage-description">
                    ChatBot is your intelligent companion that can assist you in solving problems, 
                    answering questions, and having engaging conversations. Designed for simplicity 
                    and efficiency, ChatBot makes your day-to-day tasks easier.
                </p>
            </header>
            <div className="homepage-actions">
              <h1> Log in with Google</h1>
                  <GoogleOAuthProvider clientId='206553926368-8cfbdufn01frh7hpaol33704ig4q4va9.apps.googleusercontent.com'>
                    <GoogleLogin
                      onSuccess={handleSucess}
                      onError={handleError}
                    ></GoogleLogin>
                </GoogleOAuthProvider>
            </div>
        </div>

    </div>
    
  )
}

export default GoogleLoginPage