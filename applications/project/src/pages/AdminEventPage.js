import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import './styles_admin.css';
import { authorizedUsernameHash, authorizedPasswordHash } from '../const/LoginCredentials.js';

const AdminEventPage = () => {
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    if (username !== authorizedUsernameHash || password !== authorizedPasswordHash) {
        return <Navigate to="/login-error" />;
    }

    return (
        <div class="container">
            <h1 class="title">Admin Event Page</h1>
            <div className="buttons">
                <Link to="/">
                    <button className="home-button">Home</button>
                </Link>
                <Link to="/admin">
                    <button className="admin-home-button">Admin Home</button>
                </Link>
            </div>
        </div>
    );
};

export default AdminEventPage;
