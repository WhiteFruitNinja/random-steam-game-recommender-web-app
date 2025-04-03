import React, { useState } from 'react';
import UserRegisterForm from './components/UserRegisterForm';
import UserLoginForm from './components/UserLoginForm';
import SteamApp from './components/SteamApp';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import CommentsComponent from './components/CommentsComponent';


const App = () => {
    const [userId, setUserId] = useState(null);
    const [steamAppId, setSteamAppId] = useState(null);

    const handleSteamAppIdSubmit = (id) => {
        setSteamAppId(id);
        console.log(id);
    };

    const refreshUsers = () => {
        setUserId(null);
    };

    return (
        <div className='app'>
            <AuthProvider>
                <Header steamAppId={steamAppId} setSteamAppId={setSteamAppId} onFormSubmit={handleSteamAppIdSubmit} />
                <SteamApp customSteamAppId={steamAppId} onFormSubmit={handleSteamAppIdSubmit} />
                <UserRegisterForm userId={userId} refreshUsers={refreshUsers} setUserId={setUserId} />
                <UserLoginForm/>
            </AuthProvider>
        </div>
    );
};

export default App;