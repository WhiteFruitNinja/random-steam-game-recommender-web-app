import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoggedIn(true);
            try {
                const decodedToken = jwtDecode(token);
                setUsername(decodedToken.username || decodedToken.sub);
            } catch (error) {
                console.error("Token decoding failed:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUsername(null);
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, username, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};