import React, { createContext, useState, useEffect, use } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Optional: Check token expiration
                const isExpired = decodedToken.exp * 1000 < Date.now(); // jwt exp is in seconds
                if (isExpired) {
                    handleLogout(); // If expired, log the user out
                } else {
                    setIsLoggedIn(true);
                    setUsername(decodedToken.username || decodedToken.sub);
                    setUserId(parseInt(decodedToken.userId) || decodedToken.sub); // Make sure you match this with your JWT structure
                }
            } catch (error) {
                console.error("Token decoding failed:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUsername(null);
        setUserId(null);
        // Optionally, redirect the user here:
        // navigate('/login'); // use useNavigate from react-router if needed
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, userId, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};