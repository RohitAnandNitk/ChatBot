import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleLogin from './Pages/GoogleLoginPage'; // Use PascalCase for the component
import ChatPage from './Pages/ChatPage';

// const backendUrl = "https://chatbot-vg3m.onrender.com";

function App() {
    return (
        <Router className="App">
            <Routes>
                    <Route  path ="/" element = {<GoogleLogin></GoogleLogin>}/>
                    <Route path = "/chat-page" element = {<ChatPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
