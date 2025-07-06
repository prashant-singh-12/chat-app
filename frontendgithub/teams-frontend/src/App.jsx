import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import LoginForm from './components/LoginForm.jsx';
import Chat from './components/Chat.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import {getUserNameFromToken} from "./utils/auth";

function App() {
    const currentUserName=isAuthenticated() ?getUserNameFromToken():null;
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/chat" />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route
                    path="/chat"
                    element={isAuthenticated() ? <Chat currentUserName={currentUserName} /> : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
