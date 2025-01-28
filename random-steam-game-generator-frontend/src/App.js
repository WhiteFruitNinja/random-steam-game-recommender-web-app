//import logo from './logo.svg';
//import UserListComponent from './components/UserListComponent';
//import{BrowserRouter as Router, Route, Routes} from 'react-router-dom';
//import './App.css';
//
//function App() {
//  return (
//    <div>
//      <Router>
//        <div className="App">
//          <Routes>
//            <Route path="/getlist" element={<UserListComponent/>} />
//          </Routes>
//        </div>
//      </Router>
//    </div>
//  );
//}
//
//export default App;

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