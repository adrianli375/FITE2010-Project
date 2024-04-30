import React from 'react';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractAddresses, contractABI } from '../const/SmartContract.js';


const AdminEventComponent = ({eventId, eventStar, eventTime, eventLocation, eventImgPath}) => {
    
    // define state variables
    const [seatsRemaining, setSeatsRemaining] = useState(null);
    
    let contractIdx = eventId - 1;
    const eventContractAddress = contractAddresses[contractIdx];

    // create a new Web3 instance
    const web3 = new Web3(window.ethereum);

    useEffect(() => {
        getSeatsRemaining();
    }, []);

    const getSeatsRemaining = async () => {
        if (window.ethereum) {
            var contract = new web3.eth.Contract(contractABI, eventContractAddress);
            let seats = await contract.methods.getTotalAvailableTickets().call();
            setSeatsRemaining(seats);
        }
    };
    
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
            {seatsRemaining !== null && 
                <p>Remaining Seats: <strong>{seatsRemaining}</strong></p>
            }
            <a href={`https://sepolia.etherscan.io/address/${eventContractAddress}`} 
                className="view-on-etherscan"
                target="_blank" rel="noopener noreferrer">
                View contract on Etherscan
            </a>
        </div>
    );
};

export default AdminEventComponent;
