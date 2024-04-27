import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Web3 from 'web3';
import CustomHeader from '../components/Header.js';
import EventSeatingPlan from '../components/EventSeatingPlan.js';
import WalletConnection from '../components/WalletConnection.js';
import { contractAddresses, testContractAddress, contractABI } from '../const/SmartContract.js';

const ether = 10 ** 18;

function EventBookingPage() {

    // reads in the properties (event ID)
    let { state } = useLocation();
    const eventId = state.eventId;

    if (!eventId) {
        window.location.href = './../invalid-input';
    }

    var contractIdx = eventId - 1;
    var contractAddress = contractAddresses[contractIdx];
    if (!contractAddress) {
        contractAddress = testContractAddress;
    }

    // defines the web3 object and smart contract object
    var web3 = undefined;
    var contract = undefined;
    var defaultTipPercent = 5;
    var defaultGasLimit = 3000000;

    // stores state variables
    const [walletConnected, setWalletConnected] = useState(false);
    const [eventName, setEventName] = useState();
    const [eventDetails, setEventDetails] = useState();
    const [seatsRemaining, setSeatsRemaining] = useState();
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [selectedSeatPrice, setSelectedSeatPrice] = useState(null);
    const [tipPercentValue, setTipPercentValue] = useState(defaultTipPercent);
    const [gasLimit, setGasLimit] = useState(defaultGasLimit);

    // define ref elements
    const tipInputRef = useRef(null);
    const gasLimitInputRef = useRef(null);

    // define navigate function
    const navigate = useNavigate();

    useEffect(() => {
        // first checks if the wallet address is valid
        let walletAddress = sessionStorage.getItem('walletAddress');
        if (!walletAddress) {
            alert("Wallet not connected to this site!");
        }
        else {
            setWalletConnected(true);
        }

        if (walletConnected) {
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                contract = new web3.eth.Contract(contractABI, contractAddress);
            }
            getEventName();
            getEventDetails();
            getSeatsAvailable();
            updateWalletConnection();
        }
    }, [walletConnected]);

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

    async function updateWalletConnection() {
        let walletAddress = sessionStorage.getItem('walletAddress');
        if (walletAddress) {
            setWalletConnected(true);
        }
        else {
            setWalletConnected(false);
        }
    }

    const handleCallback = async (seat, prc) => {
        setSelectedSeat(seat);
        setSelectedSeatPrice(prc);
    };

    const handleTipPercent = (evt) => {
        setTipPercentValue(evt.target.value);
    };

    const handleGasLimit = (evt) => {
        setGasLimit(evt.target.value);
    }

    async function handlePayment() {
        let navigateToPaymentPage = true;
        // re-establish wallet connection if lost
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
        }
        // edge case handling: pop out error if seat not selected
        if (!selectedSeat || !selectedSeatPrice) {
            alert("Seat not selected!");
            return;
        }
        // check if the address is connected or not
        let currentAddress = sessionStorage.getItem('walletAddress');
        if (!currentAddress) {
            alert("No address connected to the website!");
            return;
        }
        // check if the address already has a ticket
        await contract.methods.tickets(currentAddress).call()
        .then((res) => {
            var ticketId = res.ticketId;
            console.log(ticketId);
            if (ticketId > 0) {
                alert(`This address already has a ticket purchased! Ticket ID: ${ticketId}`);
                navigateToPaymentPage = false;
                return;
            }
        })
        .catch((error) => {
            alert(`An error occurred when checking the address! ${error}`);
            navigateToPaymentPage = false;
            return;
        });
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
        // else {
        //     console.log(tipPercentValue);
        // }
        // 3. check the validity of the gas limit
        if (gasLimit < 0) {
            alert('Invalid input! Gas limit must be positive!')
        }
        else if (gasLimit < 50000) {
            alert('Gas limit is too low! Set the value to be more than 50000!')
        }
        // send the data to the payment page
        if (navigateToPaymentPage) {
            let address = sessionStorage.getItem('walletAddress');
            navigate('../../event/payment', {replace: true, state: {
                eventId: eventId, seat: selectedSeat, price: priceInWei, 
                tip: tipPercentValue, gasLimit: gasLimit, address: address
            }});
        }
    }
    
    return (
        <div className="event-booking-container">
            <CustomHeader />
            {!walletConnected ?
                <div id="walletNotConnected">
                    <br></br>
                    <br></br>
                    <WalletConnection />
                    <br></br>
                    <br></br>
                    <div id="reloadButton">
                        <button onClick={() => {window.location.reload()}}>Reload after Connection</button>
                    </div>
                </div>
            :
                <div id="walletConnected">
                    <section id="eventBooking" className="section">
                        <h1 className="event-details">{eventName}</h1>
                        <h2 className="event-details">Details: {eventDetails}</h2>
                        <h2 className="subheading">Seats available: {seatsRemaining}</h2>
                        <EventSeatingPlan eventId={eventId} parentCallback={handleCallback} />
                    </section>
                    <section className="price-details">
                        <div className="seat-price-details">
                            <h3 id="selectedSeat">Selected Seat: {selectedSeat}</h3>
                            <h3 id="ticketPrice">Ticket Price: {selectedSeatPrice}</h3>
                            <div className="tip-details">
                                <h3 className="tip-payment">Input Tip Payment (%): </h3>
                                <input ref={tipInputRef} id="tipRatioInput" className="tip-payment" 
                                type="number" min="1" max="20" defaultValue={defaultTipPercent} 
                                onChange={handleTipPercent}></input>
                            </div>
                            <div className="gas-limit-details">
                                <h3 className="gas-limit">Input Gas Limit: </h3>
                                <input ref={gasLimitInputRef} id="gasLimitInput" className="gas-limit"
                                type="number" min="50000" step="10000" defaultValue={defaultGasLimit}
                                onChange={handleGasLimit}></input>
                            </div>
                            <button className="payment-button" onClick={handlePayment}>
                                Proceed to Payment
                            </button>
                        </div>
                    </section>
                </div>
            }
        </div>
    );
}


export default EventBookingPage;
