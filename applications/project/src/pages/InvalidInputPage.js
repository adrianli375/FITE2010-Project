import React from 'react';
import { Link } from 'react-router-dom';

const InvalidInputPage = () => {
    const containerStyle = {
      textAlign: 'center',
      marginTop: '2rem',
    };

    const titleStyle = {
      fontSize: '8rem',
      fontWeight: 'bold',
    };

    const messageStyle = {
      fontSize: '5rem',
      marginTop: '1rem',
    };

    const buttonStyle = {
      fontSize: '5rem'
    };

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Invalid parameters supplied!</h1>
            <p style={messageStyle}>Please ensure parameters are supplied to the page!</p>
            <Link to="/event">
                <button style={buttonStyle}>Go back</button>
            </Link>
        </div>
    );
};

export default InvalidInputPage;
