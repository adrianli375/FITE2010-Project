import React from 'react';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import './styles.css';
import CustomHeader from '../components/Header.js';
import WalletConnection from '../components/WalletConnection.js';
import Tickets from '../components/Tickets.js';
import { contractAddresses, testContractAddress, contractABI } from '../const/SmartContract.js';
import SepoliaChainId from '../const/SepoliaChainId.js';
import sleep from '../utils/Sleep.js';


const HomePage = () => {
    
    // instantiate Web3 with the injected provider
    const web3 = new Web3(window.ethereum);
    
    // stores state variables
    const [walletConnected, setWalletConnected] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState();
    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    
    // Effect: handle account changes when there is a change in connected address
    // also to update the ticket display in the home page
    useEffect(() => {
        let [connectButton, disconnectButton] = document.querySelectorAll('.wallet-connection > .button-container > button');

        // register event listeners
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountChange);
        }
        connectButton.addEventListener('click', () => getTickets(connectedAddress));
        disconnectButton.addEventListener('click', removeTicketsInDisplay);

        checkWalletConnected();
        updateConnectedAddress();

        // obtain the tickets from the connected address
        getTickets(connectedAddress);

        // cleanup event listeners
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountChange);
            }
            connectButton.removeEventListener('click', () => getTickets(connectedAddress));
            disconnectButton.removeEventListener('click', removeTicketsInDisplay);
        };
    }, [walletConnected, connectedAddress, tickets]);
    
    const checkWalletConnected = () => {
        let walletAddressExists = !!sessionStorage.getItem('walletAddress');
        walletAddressExists ? setWalletConnected(true) : setWalletConnected(false);
    };

    const updateConnectedAddress = async () => {
        let walletAddress = sessionStorage.getItem('walletAddress');
        if (walletAddress) {
            setConnectedAddress(walletAddress);
        }
    };
    
    async function getTickets(account) {
        checkWalletConnected();

        // if the account is undefined, try to obtain the account via session storage
        if (!walletConnected) {
            setLoadingTickets(true);
            for (let i = 0; i < 10; i++) {
                await sleep(0.5);
                if (account === undefined || account === null) {
                    account = sessionStorage.getItem('walletAddress');
                    if (!!account) {
                        setLoadingTickets(false);
                        break;
                    }
                }
            }
        }
        setLoadingTickets(false);

        // obtain tickets for the specific user
        if (walletConnected || !!account) {
            if (window.ethereum) {
      
                // need to ensure that the wallet is connected to the Sepolia testnet chain
                let connectedChainId = await web3.eth.getChainId();
                if (connectedChainId !== SepoliaChainId) {
                    alert("Your wallet is not connected to the Sepolia Testnet!");
                    setWalletConnected(false);
                    return;
                }

                // initialize an array variable which contains tickets
                let accountTickets = [];

                // obtain the connected address, and access its tickets
                let connectedAddress = account;
                // if the connected address is undefined or empty, obtain it from session storage
                if (!connectedAddress) {
                    connectedAddress = sessionStorage.getItem('walletAddress');
                }

                // obtain the addresses of the events
                //TODO: remove the test address later
                let ticketAddresses = [...contractAddresses, testContractAddress];
                
                // loop over each event smart contract address
                // to obtain the corresponding tickets
                for (var address of ticketAddresses) {
                    // assume the contract ABI is the same for each event
                    let contract = new web3.eth.Contract(contractABI, address);

                    // obtain the ticket and add it to the tickets array if the ticket is not empty
                    // connectedAddress is the wallet address (from an EOA account)
                    if (contract && connectedAddress) {
                        await contract.methods.tickets(connectedAddress).call()
                        .then((ticket) => {
                            // check if the ticket is not empty
                            if (ticket.seat !== "" && ticket.price !== 0) {
                                // if the ticket is not empty, add the ticket to the array
                                accountTickets.push(ticket);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    }      
                }

                // after looping through all contracts
                // check if the tickets of the account holder are identical to the previous state
                // update the array of tickets if there are updates (or first connection to website)
                if (JSON.stringify(accountTickets) !== JSON.stringify(tickets)) {
                    console.table(tickets);
                    console.table(accountTickets);
                    setTickets(accountTickets);
                }

            }
        }
    }
    
    async function removeTicketsInDisplay() {
        setTickets([]);
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
                {walletConnected && tickets.length > 0 && 
                    (!!connectedAddress || !!sessionStorage.getItem('walletAddress')) && 
                    <Tickets tickets={tickets} />
                }
            </div>
        </div>
    );
};

export default HomePage;
