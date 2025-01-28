import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';

const UserList = ({ setUserId, refreshUsers }) => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const userList = await UserService.getAllUsers();
        setUsers(userList);
    };

    const handleDelete = async (id) => {
        await UserService.deleteUser(id);
        refreshUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Users List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} - {user.email}
                        <button onClick={() => setUserId(user.id)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;