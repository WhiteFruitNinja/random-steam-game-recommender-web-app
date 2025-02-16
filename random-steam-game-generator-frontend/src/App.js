import React, { useState } from 'react';
import UserRegisterForm from './components/UserRegisterForm';
import UserList from './components/UserList';
import SteamApp from './components/SteamApp';
import Header from './Header';
import Footer from './Footer';


const App = () => {
    const [userId, setUserId] = useState(null);
    const [steamAppId] = useState(null);


    const refreshUsers = () => {
        setUserId(null);
    };

    return (
        <div className='app'>
            <Header/>
            <SteamApp appId={steamAppId}/>
            <UserRegisterForm userId={userId} refreshUsers={refreshUsers} setUserId={setUserId} />
            <Footer/>
        </div>
    );
};

export default App;