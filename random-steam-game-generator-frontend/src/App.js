import React, { useState } from 'react';
import UserRegisterForm from './components/UserRegisterForm';
import UserLoginForm from './components/UserLoginForm';
import UserList from './components/UserList';
import SteamApp from './components/SteamApp';
import Header from './Header';
import Footer from './Footer';
import { AuthProvider } from './context/AuthContext';
import { Route, Routes } from 'react-router-dom';


const App = () => {
    const [userId, setUserId] = useState(null);
    const [steamAppId] = useState(null);


    const refreshUsers = () => {
        setUserId(null);
    };

    return (
        <div className='app'>
            <AuthProvider>
                <Header/>
                <SteamApp appId={steamAppId}/>
                <UserRegisterForm userId={userId} refreshUsers={refreshUsers} setUserId={setUserId} />
                <UserLoginForm/>
                <Footer/>
            </AuthProvider>
        </div>
    );
};

export default App;