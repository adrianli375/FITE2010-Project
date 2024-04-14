import React from 'react';
import { Link } from 'react-router-dom';
import './styles_admin.css';

import { authorizedUsernameHash, authorizedPasswordHash } from '../const/LoginCredentials.js';

const username = sessionStorage.getItem('username');
const password = sessionStorage.getItem('password');
const loggedIn = username === authorizedUsernameHash && password === authorizedPasswordHash;

const AdminHomePage = () => {
    return (
        <div className="container">
          <h1 className="heading">Register your Events to attract audience on our Blockchain-based ticketing system!</h1>
          <div className="buttons">
            <Link to="/">
                <button className="home-button">Home</button>
            </Link>
            <Link to="/admin/events">
                <button className="event-button">Event Details Submission</button>
            </Link>
            {!loggedIn && (
                <Link to="/admin/login">
                    <button className="sign-in-button">Login</button>
                </Link>
            )}
          </div>
          <p className="subheading">Types of Events you could register:</p>
          <ul className="events-list">
            <li className="events-item">Concert</li>
            <li className="events-item">Sport</li>
            <li className="events-item">Orchestra</li>
            <li className="events-item">Drama</li>
            <li className="events-item">Dance</li>
            <li className="events-item">Musical</li>
            <li className="events-item">Arts</li>
            <li className="events-item">Culture</li>
          </ul>
        </div>
      );
};

export default AdminHomePage;
