import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import CustomHeader from '../components/Header.js';
import EventSeatingPlan from '../components/EventSeatingPlan.js';
import WalletConnection from '../components/WalletConnection.js';
import { contractAddress, contractABI } from '../const/SmartContract.js';

const ether = 10 ** 18;

function EventBookingPage() {
    // defines the web3 object and smart contract object
    var web3 = undefined;
    var contract = undefined;
    var defaultTipPercent = 5;

    // stores state variables
    const [eventName, setEventName] = useState();
    const [eventDetails, setEventDetails] = useState();
    const [seatsRemaining, setSeatsRemaining] = useState();
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [selectedSeatPrice, setSelectedSeatPrice] = useState(null);
    const [tipPercentValue, setTipPercentValue] = useState(defaultTipPercent);

    // define ref elements
    const tipInputRef = useRef(null);

    // define navigate function
    const navigate = useNavigate();

    useEffect(() => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
        }
        getEventName();
        getEventDetails();
        getSeatsAvailable();
    }, []);

    async function getEventName() {
        if (window.ethereum) {
            let eventName = await contract.methods.eventName().call();
            setEventName(eventName);
        }
    }

    async function getEventDetails() {
        if (window.ethereum) {
            let eventDetails = await contract.methods.eventDetails().call();
            setEventDetails(eventDetails);
        }
    }
    
    async function getSeatsAvailable() {
        if (window.ethereum) {
            let seats = await contract.methods.getTotalAvailableTickets().call();
            setSeatsRemaining(seats);
        }
    }

    const handleCallback = async (seat, prc) => {
        setSelectedSeat(seat);
        setSelectedSeatPrice(prc);
    };

    const handleTipPercent = (evt) => {
        setTipPercentValue(evt.target.value);
    };

    async function handlePayment() {
        // edge case handling: pop out error if seat not selected
        if (!selectedSeat || !selectedSeatPrice) {
            alert("Seat not selected!");
            return;
        }
        // check the validity of the variables
        setTipPercentValue(tipInputRef.current.value);
        // console.log(selectedSeat);
        // 1. convert the price into a numerical value (in wei)
        const regex = /\d+\.\d+/;
        let match = selectedSeatPrice.match(regex);
        if (match) {
            var priceInWei = match[0] * ether;
            // console.log(priceInWei);
        }
        else {
            alert("No ticket price found!");
        }
        // 2. check the validity of the tip percent
        if (tipPercentValue < 1 && tipPercentValue >= 0) {
            alert('At least 1% tip is required to process the ticket!')
        }
        else if (tipPercentValue < 0) {
            alert('Invalid input! Tip percent must be between 1% and 20%!')
        }
        else if (tipPercentValue > 20) {
            alert('Your tip is too large! Do you really want to burn that much ether?')
        }
        else {
            console.log(tipPercentValue);
        }
        // send the data to the payment page
        let paymentPrice = priceInWei * (1 + tipPercentValue / 100);
        let address = sessionStorage.getItem('walletAddress');
        let data = {seat: selectedSeat, price: paymentPrice, address: address};
        navigate('../../event/payment', {replace: true, state: {
            seat: selectedSeat, price: paymentPrice, address: address
        }});
    }
    
    return (
        <div className="event-booking-container">
            <CustomHeader />
            <br></br>
            <br></br>
            <WalletConnection />
            <section id="eventBooking" className="section">
                <h1 className="event-details">{eventName}</h1>
                <h2 className="event-details">Details: {eventDetails}</h2>
                <h2 className="subheading">Seats available: {seatsRemaining}</h2>
                <EventSeatingPlan parentCallback={handleCallback} />
            </section>
            <section className="price-details">
                <div className="seat-price-details">
                    <h3 id="selectedSeat">Selected Seat: {selectedSeat}</h3>
                    <h3 id="ticketPrice">Ticket Price: {selectedSeatPrice}</h3>
                    <div className="tip-details">
                        <h3 className="tip-payment">Select Tip Payment (%): </h3>
                        <input ref={tipInputRef} id="tipRatioInput" className="tip-payment" 
                        type="number"min="1" max="20" defaultValue={defaultTipPercent} 
                        onChange={handleTipPercent}></input>
                    </div>
                    <button className="payment-button" onClick={handlePayment}>
                        Proceed to Payment
                    </button>
                </div>
            </section>
        </div>
    );
}


export default EventBookingPage;
