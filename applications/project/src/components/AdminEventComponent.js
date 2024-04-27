import React from 'react';
import { contractAddresses } from '../const/SmartContract.js';


const AdminEventComponent = ({eventId, eventStar, eventTime, eventLocation, eventImgPath}) => {
    
    let contractIdx = eventId - 1;
    const eventContractAddress = contractAddresses[contractIdx];
    
    return (
        <div className="event">
            <div className="event-text">
                <h3 className="event-title">{eventStar}</h3>
                <p className="event-details">{eventTime}</p>
                <p className="event-details">{eventLocation}</p>
            </div>
            <div className="event-image">
                <img src={eventImgPath} alt={eventStar} />
            </div>
            <br></br>
            <a href={`https://sepolia.etherscan.io/address/${eventContractAddress}`} 
                className="view-on-etherscan"
                target="_blank" rel="noopener noreferrer">
                View contract on Etherscan
            </a>
        </div>
    );
};

export default AdminEventComponent;
