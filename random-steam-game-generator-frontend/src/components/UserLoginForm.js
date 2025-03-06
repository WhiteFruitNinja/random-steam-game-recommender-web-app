import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';

const UserLoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //const navigate = useNavigate();

    useEffect(() => {
      // Check local storage on component mount
      const user = localStorage.getItem("authToken"); // Change 'user' to whatever key you choose
      if (user) {
          setIsLoggedIn(true);
      }
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      const loginData = {
          username,
          password
      };

      try {
        const response = await UserService.loginUser(loginData.username, loginData.password); // Await the promise
        console.log(response.status);
        if (response && response.status === 200) {
          console.log(response);
          
          const token = response.data.token
          localStorage.setItem("authToken", token); // Store user data as needed

          setIsLoggedIn(true);

          window.location.reload();
          //navigate('/');
          // Here you might want to redirect the user or store a token
        }
      } catch(error) {
        console.error('Login error:', error); // Log the error for debugging
        alert('An error occurred. Please retry.');
      }
    }

    const handleLogout = () => {
      localStorage.removeItem("authToken"); // Clear user data from local storage
      setIsLoggedIn(false); // Update state to reflect that the user has logged out
      window.location.reload();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="modal modal-login" id="loginModal" tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Login</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body" style={{textAlign: "left"}}>
                        <h6>Username</h6>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                        <h6>Password</h6>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className='btn btn-dark'>login</button>
                      </div>
                    </div>
                  </div>
                </div>
            </form>
        </div>
    );
}

export default UserLoginForm;