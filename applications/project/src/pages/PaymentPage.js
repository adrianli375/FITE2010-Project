import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Web3 from 'web3';
import CustomHeader from '../components/Header.js';
import { contractAddress, contractABI } from '../const/SmartContract.js';
import TestNFT from '../const/NFTs.js';

const gwei = 10 ** 9;
const ether = 10 ** 18;

function PaymentPage() {
    const location = useLocation();

    if (!location.state.seat || !location.state.price || 
        !location.state.tip || !location.state.gasLimit || 
        !location.state.address) {
        window.location.href = './../invalid-input';
    }
    
    const seat = location.state.seat;
    const price = location.state.price / ether;
    const tip = location.state.tip;
    const gasLimit = location.state.gasLimit;
    const address = location.state.address;

    // defines the web3 object and smart contract object
    var web3 = undefined;
    var contract = undefined;

    // stores state variables
    const [eventName, setEventName] = useState();
    const [eventDetails, setEventDetails] = useState();
    const [currentGasPrice, setCurrentGasPrice] = useState('unknown');
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceExcludeGasFees, setTotalPriceExcludeGasFees] = useState(0);
    const [gasUsed, setGasUsed] = useState(0);
    const [txHash, settxHash] = useState();
    const [contractAddressFromReceipt, setContractAddressFromReceipt] = useState();
    const [nftTokenId, setNftTokenId] = useState();
    const [addressIsValid, setAddressIsValid] = useState(false);
    const [paid, setPaid] = useState(false);
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const [hasErr, setHasErr] = useState(false);
    const [err, setErr] = useState();

    useEffect(() => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
        }
        getEventName();
        getEventDetails();
        getCurrentGasPrice();
        getTotalPriceExcludeGasFees();
        getTotalPrice();
    }, [currentGasPrice]);

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

    async function getCurrentGasPrice() {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            let gasPriceInWei = await web3.eth.getGasPrice(); // in wei
            let gasPriceInGwei = gasPriceInWei / gwei;
            setCurrentGasPrice(gasPriceInGwei);
        }
    }

    async function getTotalPriceExcludeGasFees() {
        let totalPrice = price * (1 + tip / 100);
        setTotalPriceExcludeGasFees(totalPrice);
    }
    
    async function getTotalPrice() {
        let totalPrice = price * (1 + tip / 100) + gasLimit * currentGasPrice / gwei;
        setTotalPrice(totalPrice);
    }

    const handlePayment = async () => {
        // re-establish web3 connection if lost
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
        }

        // again, check if the sender address has already purchased a ticket or not
        await contract.methods.tickets(address).call()
        .then((res) => {
            var ticketId = res.ticketId;
            if (ticketId > 0) {
                alert(`This address already has a ticket purchased! Ticket ID: ${ticketId}`);
                return;
            }
            else {
                setAddressIsValid(true);
            }
        })
        .catch((error) => {
            alert(`An error occurred when checking the address! ${error}`);
            return;
        });

        if (addressIsValid) {
            const tx = {
                from: address, // from sender address
                to: contractAddress, // to smart contract address
                value: web3.utils.toWei(`${totalPriceExcludeGasFees}`, 'ether'), // value in ether
                gas: gasLimit,
                //TODO: change the testNFT to event-specific ones
                data: contract.methods.createTicket(seat, TestNFT).encodeABI()
            };

            web3.eth.sendTransaction(tx)
            .on('sending', (payload) => {
                // console.log('sending');
                setPaymentInitiated(true);
            })
            .on('transactionHash', (hash) => {
                settxHash(hash);
                // console.log('Transaction hash:', hash);
            })
            .on('confirmation', async (confirmationNumber, receipt) => {
                // console.log(`Confirmation number: ${confirmationNumber}`)
                let receiptStatus = receipt.status;
                let logs = receipt.logs;
                if (!receiptStatus) {
                    // transaction error caught by smart contract
                    // as EVM reverted the transaction
                    console.log('Tx reverted by EVM');
                    console.log(logs);
                    logs.forEach((msg) => console.log(msg));
                }
                else { 
                    // indicate payment successful message
                    // indicate gas used
                    let gasUsed = receipt.gasUsed;
                    setGasUsed(gasUsed);
                    // return the contract address
                    let contractAddressFromReceipt = receipt.to;
                    setContractAddressFromReceipt(contractAddressFromReceipt);
                    // get ticket ID, tell user to obtain the corresponding NFT
                    await contract.methods.tickets(receipt.from).call()
                    .then((res) => {
                        var ticketId = res.ticketId;
                        // console.log(ticketId);
                        setNftTokenId(ticketId);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                    setPaid(true);
                    setPaymentInitiated(false);
                }
            })
            .on('error', (error) => {
                setHasErr(true);
                let msg = error.message;
                setErr(msg);
                setPaymentInitiated(false);
            });
        }
    };

    return (
        <div className="event-payment-container">
            <CustomHeader />
            <br></br>
            <br></br>
            <div className="payment-details">
                <h2>Confirmation of Payment</h2>
                <div>
                    <h3>Event: {eventName}</h3>
                    <h3>Details: {eventDetails}</h3>
                </div>
                <div>
                    <h3>Order Details</h3>
                    <p>Seat: <strong>{seat}</strong></p>
                    <p>Price: <strong>{price} ether</strong>, Tips (<strong>{tip}%</strong> of price): <strong>{price * tip / 100} ether</strong></p>
                    <p>Base Cost: <strong>{totalPriceExcludeGasFees} ether</strong></p>
                    {!paid && 
                        <div>
                            <p>Estimated Gas Cost: <strong>{gasLimit * currentGasPrice} gwei</strong> (Current Gas Price: <strong>{currentGasPrice} gwei</strong>, Gas Limit: {gasLimit})</p>
                            <p>Estimated total cost: <strong>{totalPrice} ether</strong></p>
                        </div>
                    }
                    <p>Spending from address: {address}</p>
                    {!paid && !paymentInitiated && 
                        <div className="payment-buttons">
                            <Link to="/event/booking">
                                <button>Back</button>
                            </Link>
                            <button onClick={getCurrentGasPrice}>Refresh Gas Cost</button>
                            <button onClick={handlePayment}>Pay Now</button>
                        </div>
                    }
                </div>
            </div>
            {/* Payment processing component: renders when the payment is processing but not yet confirmed */}
            {paymentInitiated && !paid && 
                <div className="payment-in-progress">
                    <h3>Processing payment...</h3>
                    <progress value={null}></progress>
                </div>
            }
            {/* Payment success component: renders when the payment is successfully made */}
            {!paymentInitiated && paid && 
                <div className="payment-success">
                    <h2>Payment success!</h2>
                    <h3>Gas used: {gasUsed}</h3>
                    <h3>Please obtain your NFT token (ID: {nftTokenId}) from the following contract address: </h3>
                    <h3>{contractAddressFromReceipt}</h3>
                    <Link to="/">
                        <button>Return to Home Page</button>
                    </Link>
                </div>
            }
            {/* Error component: renders when an error occurs */}
            {!paymentInitiated && hasErr && 
                <div className="error-message">
                    <p id="err">Error: {err}</p>
                </div>
            }
        </div>
    );

}

export default PaymentPage;
