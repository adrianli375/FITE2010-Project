import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Web3 from 'web3';
import Clipboard from '../components/CopyClipboard.js';
import CustomHeader from '../components/Header.js';
import Tickets from '../components/Tickets.js';
import { testContractAddress, contractABI } from '../const/SmartContract.js';
import zeroAddress from '../const/ZeroAddress.js';


function TransferPage() {

    // placeholder: to be updated soon
    var contractAddress = testContractAddress;
    
    // defines the web3 object and smart contract object
    var web3 = undefined;
    var contract = undefined;

    let { state } = useLocation();
    let ticketData = !!state ? [JSON.parse(state.ticket)] : {};

    // set state variables
    const [ticket, setTicket] = useState(ticketData);
    const [recipientAddress, setRecipientAddress] = useState();
    const [transferBaseCost, setTransferBaseCost] = useState(0.0001); // in ether
    const [gasLimit, setGasLimit] = useState(3000000); // default gas limit in Remix IDE
    const [txHash, settxHash] = useState();
    const [transferInitiated, setTransferInitiated] = useState(false);
    const [transferred, setTransferred] = useState(false);
    const [hasErr, setHasErr] = useState(false);
    const [err, setErr] = useState(false);

    // define ref elements
    const transferAddressRef = useRef(null);

    // use effect
    useEffect(() => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            window.ethereum.on('accountsChanged', detectAccountChanges);
        }

        // cleanup
        return () => {
            if (window.ethereum) {
                window.ethereum.off('accountsChanged', detectAccountChanges);
            }
        };

    }, [recipientAddress]);

    const detectAccountChanges = async () => {
        // obtain the newly connected address
        // request user to connect accounts (Metamask will prompt)
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    
        // get the connected account
        const accounts = await web3.eth.getAccounts();
        let connectedAccount = accounts[0];
        sessionStorage.setItem('walletAddress', connectedAccount);

        // whenever there are any account changes in wallet, 
        // redirect the user back to homepage
        window.location.href = '..';
        alert("Detected account change! Redirecting back to homepage...");
    };

    const updateTransferAddress = (evt) => {
        setRecipientAddress(evt.target.value);
    };

    const checkAddressFormat = (addr) => {
        const regex = /^0x[0-9a-fA-F]{40}$/;
        return regex.test(addr);
    };

    const isContractAddress = async (addr) => {
        if (window.ethereum) {
            const code = await web3.eth.getCode(addr);
            return code !== '0x';
        }
    }

    const addressHasTicket = async (addr) => {
        if (window.ethereum) {
            await contract.methods.tickets(addr).call()
            .then((res) => {
                var ticketId = res.ticketId;
                if (ticketId > 0) {
                    alert(`This address already has a ticket purchased! Ticket ID: ${ticketId}`);
                    return true;
                }
            })
            .catch((error) => {});
        }
    }

    const checkAddressValidity = (addr) => {
        // 1. check if the address is the zero address, if yes, return false
        if (addr === zeroAddress) {
            alert("Cannot transfer to the zero address!");
            return false;
        }
        // 2. check if the address is the sending address, if yes, return false
        let sendingAddress = sessionStorage.getItem("walletAddress");
        if (addr === sendingAddress) {
            alert("You cannot transfer the ticket to yourself!")
            return false;
        }
        // 3. check if the address is a contract address, if yes, return false
        isContractAddress(addr)
        .then((isContract) => {
            if (isContract) {
                alert("You cannot transfer the ticket to a contract!")
                return false;
            }
        })
        .catch((error) => {});
        // 4. check if the address already has an ticket or not, if yes, return false
        addressHasTicket(addr)
        .then((hasTicket) => {
            if (hasTicket) {
                alert("This address already has a ticket!")
                return false;
            }
        })
        .catch((error) => {});
        // after passing all checks, set the addressIsValid variable to be true
        return true;
    };
    
    async function handleTransfer() {
        // re-establish web3 connection if lost
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
        }
        // console.log(recipientAddress);

        // check the validity of the address format
        let addressHasCorrectFormat = checkAddressFormat(recipientAddress);
        if (!addressHasCorrectFormat) {
            alert("Address has wrong format!");
            return Promise.resolve(false);
        }

        // check the validity of the address
        let addressIsValid = checkAddressValidity(recipientAddress);
        if (!addressIsValid) {
            alert("Address is invalid!");
            return Promise.resolve(false);
        }

        // after passing all checks, call the transfer function from the contract
        // console.log('transfer');
        const sendingAddress = sessionStorage.getItem("walletAddress");
        let ticketTransferCount = Number(ticket[0].transferCount);
        let transferCost = transferBaseCost * (2 ** (ticketTransferCount + 1));
        // initiate the transaction
        const tx = {
            from: sendingAddress, // from sender address
            to: contractAddress, // to smart contract address
            value: web3.utils.toWei(`${transferCost}`, 'ether'), // value in ether
            gas: gasLimit,
            //TODO: change the testNFT to event-specific ones
            data: contract.methods.transferTicket(recipientAddress).encodeABI()
        };

        web3.eth.sendTransaction(tx)
        .on('sending', (payload) => {
            setTransferInitiated(true);
        })
        .on('transactionHash', (hash) => {
            settxHash(hash);
            // console.log('Transaction hash:', hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
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
                console.log(`Gas Used: ${gasUsed}`);
                // update ticket
                let transferredTicket = ticket;
                transferredTicket[0].transferCount++;
                setTicket(transferredTicket);
                // update state variables
                setTransferred(true);
                setTransferInitiated(false);
            }
        })
        .on('error', (error) => {
            setHasErr(true);
            let msg = error.message;
            setErr(msg);
            setTransferInitiated(false);
        });
    }

    return (
        <div>
            <CustomHeader />
            <br></br>
            <br></br>
            <h1 className="transfer-page-header">Transfer Your Ticket</h1>
            <div className="transfer-page-container">
                {!!ticket && Object.keys(ticket).length > 0 ?
                    <>
                        <Tickets tickets={ticket} />
                        {/* Initial component: when transfer is not yet initiated */}
                        {!transferInitiated && !transferred && 
                            <section className="transfer-section">
                                <div className="transfer-section-left">
                                    <h2>Send the ticket to the following address: </h2>
                                    <input className="transfer-address-input" 
                                        ref={transferAddressRef} onChange={updateTransferAddress}></input>
                                </div>
                                <button className="transfer-button" 
                                    onClick={() => {handleTransfer()}}>Transfer Ticket</button>
                            </section>
                        }
                        {/* Transfer processing component: renders when the transfer is processing but not yet confirmed */}
                        {transferInitiated && !transferred && 
                            <div className="transfer-in-progress">
                                <h3>Ticket transfer in progress...</h3>
                                <progress value={null}></progress>
                            </div>
                        }
                        {/* Transfer success component: renders when the ticket is successfully transferred */}
                        {!transferInitiated && transferred &&
                            <div className="transfer-success">
                                <h2>Ticket transfer success!</h2>
                                <h4>
                                    Ticket transferred to address: {recipientAddress}
                                    <Clipboard textToCopy={recipientAddress} />
                                </h4>
                                <a href={`https://sepolia.etherscan.io/tx/${txHash}`} className="view-on-etherscan"
                                    target="_blank" rel="noopener noreferrer">
                                    View transaction on Etherscan
                                </a>
                                <Link to="/">
                                    <button>Return to Home Page</button>
                                </Link>
                            </div>
                        }
                        {/* Error component: renders when an error occurs */}
                        {!transferInitiated && hasErr && 
                            <div className="transfer-error-message">
                                <p id="err">Error: {err}</p>
                            </div>
                        }
                    </>
                    :
                    <>
                        <h2>No ticket found!</h2>
                        <Link to="/">
                            <button>Return to Home Page</button>
                        </Link>
                    </>
                }
            </div>
        </div>
    )
}


export default TransferPage;
