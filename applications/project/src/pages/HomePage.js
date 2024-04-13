import React from 'react';
import './styles.css';
import CustomHeader from '../components/Header.js';
import WalletConnection from '../components/WalletConnection.js';

const HomePage = () => {
    return (
        <div className="event-container">
            <CustomHeader />
            <br></br>
            <br></br>
            <WalletConnection />
            <h1> Welcome! </h1>
        </div>
    );
};

export default HomePage;
