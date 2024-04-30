import React from 'react';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import './styles.css';
import CustomHeader from '../components/Header.js';
import WalletConnection from '../components/WalletConnection.js';
import Tickets from '../components/Tickets.js';
import { testContractAddress, contractABI } from '../const/SmartContract.js';
import SepoliaChainId from '../const/SepoliaChainId.js';


const HomePage = () => {
    
    // instantiate Web3 with the injected provider
    const web3 = new Web3(window.ethereum);
    
    // stores state variables
    const [walletConnected, setWalletConnected] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState();
    const [tickets, setTickets] = useState([]);
    const [ticketIsEmpty, setTicketIsEmpty] = useState(true);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountChange);
        }
        checkWalletConnected();
        updateConnectedAddress();
        getTickets(connectedAddress);
        removeTickets();

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountChange);
            }
        };

    }, [walletConnected, connectedAddress, tickets]);
    
    const checkWalletConnected = () => {
        let walletAddressExists = !!sessionStorage.getItem('walletAddress');
        walletAddressExists ? setWalletConnected(true) : setWalletConnected(false);
    };

    const updateConnectedAddress = async () => {
        let walletAddress = sessionStorage.getItem('walletAddress');
        if (walletAddress) {
            setConnectedAddress(connectedAddress);
        }
    };
    
    async function getTickets(account) {
        checkWalletConnected();

        // get ticket ID, tell user to obtain the corresponding NFT
        if (walletConnected) {
            if (window.ethereum) {
      
                // need to ensure that the wallet is connected to the Sepolia testnet chain
                let connectedChainId = await web3.eth.getChainId();
                if (connectedChainId !== SepoliaChainId) {
                    alert("Your wallet is not connected to the Sepolia Testnet!");
                    setWalletConnected(false);
                    return;
                }

                // placeholder only, to be removed in multiple-tickets update
                let contractAddress = testContractAddress;
                
                const contract = new web3.eth.Contract(contractABI, contractAddress);
                let connectedAddress = account;
                if (!connectedAddress) {
                    connectedAddress = sessionStorage.getItem('walletAddress');
                }

                if (contract && connectedAddress) {
                    await contract.methods.tickets(connectedAddress).call()
                    .then((ticket) => {
                        setTickets([ticket]);
                        // console.log(ticket);
                        (ticket.seat !== "" && ticket.price !== 0) ? setTicketIsEmpty(false) : setTicketIsEmpty(true);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
                else {
                    alert("No wallet address connected!");
                    setWalletConnected(false);
                }
            }
        }
    }
    
    async function removeTickets() {
        checkWalletConnected();

        if (!walletConnected) {
            setTickets([]);
        }
    }

    async function handleAccountChange(accounts) {
        setTickets([]);
        let connectedAccount = accounts[0];
        // console.log(connectedAccount);
        setConnectedAddress(connectedAccount);
        await updateConnectedAddress();
        await getTickets(connectedAccount);
    }

    return (
        <div className="event-container">
            <CustomHeader />
            <br></br>
            <br></br>
            <WalletConnection />
            <br></br>
            <div className="homepage-container">
                <h1> Welcome! </h1>
                {walletConnected && !!tickets && !ticketIsEmpty && !!sessionStorage.getItem('walletAddress') && 
                    <Tickets tickets={tickets} />
                }
            </div>
        </div>
    );
};

export default HomePage;
