import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AdminEventComponent from '../components/AdminEventComponent.js';
import './styles_admin.css';
import { authorizedUsernameHash, authorizedPasswordHash } from '../const/LoginCredentials.js';

const AdminEventPage = () => {
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    if (username !== authorizedUsernameHash || password !== authorizedPasswordHash) {
        return <Navigate to="/login-error" />;
    }

    return (
        <div className="container">
            <h1 className="title">Admin Event Page</h1>
            <div className="buttons">
                <Link to="/">
                    <button className="home-button">Home</button>
                </Link>
                <Link to="/admin">
                    <button className="admin-home-button">Admin Home</button>
                </Link>
                <Link to="/admin/apply-event">
                    <button className="admin-event-application-button">Apply for a New Event</button>
                </Link>
            </div>
            <section className="events-section">
                <h2 className="events-title">Your Approved Events</h2>
                <br></br>
                <div className="events-container">
                    <AdminEventComponent eventId={1} eventStar="Panther Chan" eventTime="Apr 13 - 8:15PM" 
                    eventLocation="Star Hall, KITEC" eventImgPath="/imgs/panther-chan.png"/>
                    <AdminEventComponent eventId={2} eventStar="Kaho Hung" eventTime="Apr 13 - 8:15PM" 
                    eventLocation="Hong Kong Coliseum" eventImgPath="/imgs/kaho-hung.png" />
                    <AdminEventComponent eventId={3} eventStar="Creamfield HK" eventTime="Apr 14 - 5:00PM" 
                    eventLocation="Central Harbourfront Event Space" eventImgPath="/imgs/creamfield-hk.png" />
                    <AdminEventComponent eventId={4} eventStar="Midlife, Sing & Shine 2" eventTime="Jul 19 - 8:15PM" 
                    eventLocation="Hong Kong Coliseum" eventImgPath="/imgs/midlife-sing-shine.png" />
                </div>
            </section>
        </div>
    );
};

export default AdminEventPage;
