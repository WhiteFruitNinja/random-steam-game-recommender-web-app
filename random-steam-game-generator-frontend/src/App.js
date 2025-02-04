import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import SteamApp from './components/SteamApp';

const App = () => {
    const [userId, setUserId] = useState(null);
    const [steamAppId] = useState(null);


    const refreshUsers = () => {
        setUserId(null);
    };

    return (
        <div>
            <SteamApp appId={steamAppId}/>
            <UserForm userId={userId} refreshUsers={refreshUsers} setUserId={setUserId} />
            <UserList setUserId={setUserId} refreshUsers={refreshUsers} />
        </div>
    );
};

export default App;