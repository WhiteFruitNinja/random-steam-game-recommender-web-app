import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';

const UserRegisterForm = ({ userId, refreshUsers, setUserId }) => {
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
        <div>
            <form onSubmit={handleSubmit}>
                <div className="modal modal-register" id="signupModal" tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Signup</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body" style={{textAlign: "left"}}>
                        <h6>Username</h6>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                        <h6>Email</h6>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <h6>Password</h6>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <h6>Confirm Password</h6>
                        <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required />
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className='btn btn-dark'>{userId ? "Update" : "Register"}</button>
                        {userId && <button type="button" onClick={() => setUserId(null)}>Register</button>}
                      </div>
                    </div>
                  </div>
                </div>
            </form>
        </div>
    );
};

export default UserRegisterForm;