import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';

const UserForm = ({ userId, refreshUsers, setUserId }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");


    useEffect(() => {
        if (userId) {
            UserService.getUserById(userId).then(user => {
                setUsername(user.username);
                setEmail(user.email);
            });
        } else {
            setUsername("");
            setEmail("");
        }
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const user = {
                username,
                email,
                password,
                passwordConfirm
            };

            if (userId) {
                await UserService.updateUser(userId, user);
                alert("User updated successfully");
            } else {
                await UserService.createUser(user);
                alert("User registered successfully");
            }

            setUsername("");
            setEmail("");
            setPassword("");
            setPasswordConfirm("");
            setUserId(null);
            refreshUsers(); // Refresh the list after the operation
        } catch (error) {
            console.log(username, email, password, passwordConfirm)
            console.error("There was an error!", error);
            alert("Error occurred");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{userId ? "Update User" : "Register User"}</h2>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />
            <button type="submit">{userId ? "Update" : "Register"}</button>
            {userId && <button type="button" onClick={() => setUserId(null)}>Cancel</button>}
        </form>
    );
};

export default UserForm;