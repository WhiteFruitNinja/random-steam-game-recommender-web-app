import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext'; // Adjust the import based on your context file structure

const Header = () => {
    const { isLoggedIn, handleLogout, username } = useContext(AuthContext); // Use context to get login state and logout handler

    return (
        <div className="header-parent">
            <div className="header-child">
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">Random Steam Game Generator</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {/* Conditionally render Login and Signup buttons or Logout button */}
                            {!isLoggedIn ? (
                                <>
                                    <div style={{display: "flex", marginLeft: "auto"}}>
                                        <button className="btn btn-outline-success" type="button" data-bs-toggle="modal" data-bs-target="#loginModal" style={{ marginInline: '5px' }}>Login</button>
                                        <button className="btn btn-outline-success" type="button" data-bs-toggle="modal" data-bs-target="#signupModal" style={{ marginInline: '5px' }}>Signup</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{display: "flex", marginLeft: "auto"}}>
                                        <p style={{margin: "auto", paddingInline: "10px"}}>Signed in as {username}</p>
                                        <button onClick={handleLogout} className='btn btn-danger'>Logout</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Header;