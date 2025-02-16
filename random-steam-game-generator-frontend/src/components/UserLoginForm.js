import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';

const UserLoginForm = ({ userId, refreshUsers, setUserId }) => {
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
}

export default UserLoginForm;