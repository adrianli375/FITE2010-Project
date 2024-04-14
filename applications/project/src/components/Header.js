import React from 'react';
import { Link } from 'react-router-dom';


const CustomHeader = () => {
    return (
        <header className="header">
            <nav>
            <ul>
                {/* TODO: link to appropriate routes */}
                <Link to="/">
                    <li>Home</li>
                </Link>
                <Link to="/event">
                    <li>Events</li>
                </Link>
                <Link to="/about">
                    <li>About</li>
                </Link>
            </ul>
            </nav>
        </header>
    );
};

export default CustomHeader;
