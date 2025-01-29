import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

const App = () => {
    const [userId, setUserId] = useState(null);

    const refreshUsers = () => {
        setUserId(null);
    };

    return (
        <div>
            <UserForm userId={userId} refreshUsers={refreshUsers} setUserId={setUserId} />
            <UserList setUserId={setUserId} refreshUsers={refreshUsers} />
        </div>
    );
};

export default App;