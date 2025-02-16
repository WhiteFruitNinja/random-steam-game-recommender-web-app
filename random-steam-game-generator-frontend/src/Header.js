import React from 'react';

const Header=()=>{
    return(
        <div className="header-parent">
          <div className="header-child">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
              <div className="container-fluid">
                <a className="navbar-brand" href="#">Random Steam Game Generator</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{flex: 'none'}}>
                  <button className="btn btn-outline-success" type="submit" style={{marginInline: '5px'}}>Login</button>
                  <button className="btn btn-outline-success" type="submit" data-bs-toggle="modal" data-bs-target=".modal" style={{marginInline: '5px'}}>Signup</button>
                </div>
              </div>
            </nav>
          </div>
        </div>
    )
}

export default Header;