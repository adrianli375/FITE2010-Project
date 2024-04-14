import React, { useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import web3 from 'web3';
import './styles_admin.css';
import { authorizedUsernameHash, authorizedPasswordHash } from '../const/LoginCredentials.js';

const AdminLoginPage = () => {
    const usernameInput = useRef(null);
    const passwordInput = useRef(null);
    const loginButton = useRef(null);
    const navigate = useNavigate();

    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    const loggedIn = username === authorizedUsernameHash && password === authorizedPasswordHash;

    if (loggedIn) {
        return <Navigate to="/admin/events" />;
    }

    const handleLogin = (e) => {
        e.preventDefault();
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;
        const hashedUsername = web3.utils.keccak256(username).toString();
        const hashedPassword = web3.utils.keccak256(password).toString();

        if (hashedUsername === authorizedUsernameHash && 
            hashedPassword === authorizedPasswordHash) {
            sessionStorage.setItem('username', hashedUsername);
            sessionStorage.setItem('password', hashedPassword);
            navigate('/admin/events');
        } else {
            alert('Invalid username or password');
        }
    };
    
    return (
        <div class="container">
            <h1 class="title">Admin Login Page</h1>
            <div className="buttons">
                <Link to="/">
                    <button className="home-button">Home</button>
                </Link>
                <Link to="/admin">
                    <button className="admin-home-button">Admin Home</button>
                </Link>
            </div>
            <form class="login-form" onSubmit={handleLogin}>
                <label for="username">User Name*</label>
                <input type="text" id="username" name="username" required ref={usernameInput}/>
                <label for="password">User Password*</label>
                <input type="password" id="password" name="password" required ref={passwordInput}/>
                <button type="submit" id="login-button" ref={loginButton}>User Login</button>
            </form>
        </div>
    );
};

export default AdminLoginPage;
