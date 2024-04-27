import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import Clipboard from '../components/CopyClipboard.js';
import { contractABI } from '../const/SmartContract.js';
import SepoliaChainId from '../const/SepoliaChainId.js';
import sleep from '../utils/Sleep.js';


const AdminEventApplicationPage = () => {
    
    // form attributes
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('20:00');
    const [eventVenue, setEventVenue] = useState('');
    const [eventRows, setEventRows] = useState(0);
    const [eventCols, setEventCols] = useState(0);
    const [eventTicketTransferLimit, setEventTicketTransferLimit] = useState(1);
    const [applicationType, setApplicationType] = useState('');
    const [applicantEmail, setApplicantEmail] = useState(null);

    // other state variables
    const [isManualApplication, setIsManualApplication] = useState(false);
    const [isAutoApplication, setIsAutoApplication] = useState(false);
    const [applicationInProgress, setApplicationInProgress] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState();
    const [applicationFinished, setApplicationFinished] = useState(false);
    const [deploymentTxHash, setDeploymentTxHash] = useState();
    const [deploymentGasUsed, setDeploymentGasUsed] = useState(0);
    const [deployedContractAddress, setDeployedContractAddress] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // handle the manual application type - render the pending approval page
        if (applicationType === 'manual') {
            setIsManualApplication(true);
            setApplicationFinished(true);
        }
        // handle the automatic application type - deploy to a new smart contract
        else if (applicationType === 'auto') {
            if (window.ethereum) {
                var web3 = new Web3(window.ethereum);
                var undeployedContract = new web3.eth.Contract(contractABI);

                setIsAutoApplication(true);
                setApplicationInProgress(true);

                // pre-process the inputs to deploy the smart contract
                // split the eventDate into month and day
                const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
                const [_, eventYear, eventMonth, eventDay] = regex.exec(eventDate);
                let date = new Date(eventYear, eventMonth - 1, eventDay)
                let month = date.toLocaleString('default', {month: 'short'}).slice(0, 3);

                // update the eventTime to 12-hour format
                const regex2 = /^(\d{2}):(\d{2})/;
                const [fullTime, hour, minute] = regex2.exec(eventTime);
                let convertedTime = `${hour > 12 ? hour - 12 : hour}:${minute}${hour >= 12 ? "PM" : "AM"}`;

                let eventDetails = `${month} ${eventDay} - ${convertedTime}`;
                console.log(eventDetails);

                // need to ensure that the wallet is connected to the Sepolia testnet chain
                let connectedChainId = await web3.eth.getChainId();
                if (connectedChainId !== SepoliaChainId) {
                    alert("Your wallet is not connected to the Sepolia Testnet!");
                    return;
                }
                // obtain the wallet address
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                let connectedAddress = accounts[0];
                console.log(`Address connected: ${connectedAddress}`);

                // obtain the bytecode
                //TODO: change back to master branch instead of current working branch
                await fetch('https://raw.githubusercontent.com/adrianli375/FITE2010-Project/admin-page-application/applications/project/src/const/SmartContractByteCode.bin')
                .then((response) => {
                    response.text()
                    .then((result) => {
                        let bytecode = `0x${result}`;
                        console.log('Bytecode obtained');

                        // deploy the contract
                        if (!!connectedAddress && !!bytecode) {
                            undeployedContract.deploy({
                                data: bytecode,
                                arguments: [eventName]
                            })
                            .send({
                                from: connectedAddress
                            })
                            .on('error', (error) => {
                                alert(error.message);
                                setApplicationInProgress(false);
                            })
                            .on('transactionHash', (transactionHash) => {
                                setDeploymentTxHash(transactionHash);
                                setApplicationMessage('Deployment in progress...')
                            })
                            .on('confirmation', async (confirmationNumber, receipt) => {
                                // indicate payment successful message
                                // indicate gas used
                                let gasUsed = receipt.gasUsed;
                                setDeploymentGasUsed(gasUsed);
                                // return the contract address
                                let contractAddressFromReceipt = receipt.contractAddress;
                                setDeployedContractAddress(contractAddressFromReceipt);
                                setApplicationMessage('Contract deployed! Setting up event details...')
                                // after deploying the contract, set up other event and ticket details
                                contractSetup(contractAddressFromReceipt, eventDetails, connectedAddress);
                                console.log('Setup finished!');
                                await sleep(2);
                                setApplicationMessage('Finished!');
                                setApplicationInProgress(false);
                                setApplicationFinished(true);
                            });
                        }
                    });
                })
                .catch((err) => alert('Cannot fetch bytecode'));
            }
        }
    };

    const contractSetup = async (contractAddress, eventDetails, connectedAddress) => {
        var web3 = new Web3(window.ethereum);
        const deployedContract = new web3.eth.Contract(contractABI, contractAddress);
        if (!!deployedContract) {
            // set up event details
            await deployedContract.methods.setEventDetails(eventDetails)
            .send({from: connectedAddress})
            .on('error', (error) => {
                alert(error.message);
                setApplicationInProgress(false);
            })
            .on('confirmation', (confirmation, receipt) => console.log('Event details set!'));

            // set up seating plan
            await deployedContract.methods.setSeatingPlanDetails(eventRows, eventCols)
            .send({from: connectedAddress})
            .on('error', (error) => {
                alert(error.message);
                setApplicationInProgress(false);
            })
            .on('confirmation', (confirmation, receipt) => console.log('Seating plan details set!'));

            // set up ticket resale details
            await deployedContract.methods.setTicketPriceDetails(eventTicketTransferLimit)
            .send({from: connectedAddress})
            .on('error', (error) => {
                alert(error.message);
                setApplicationInProgress(false);
            })
            .on('confirmation', (confirmation, receipt) => console.log('Ticket details set!'));
        }
    };

    return (
        <div className="container">
            <h1>Admin Event Application Page</h1>
            <div className="buttons">
                <Link to="/admin">
                    <button className="admin-home-button">Admin Home</button>
                </Link>
                <Link to="/admin/events">
                    <button className="event-button">Your Events</button>
                </Link>
            </div>
            <h1>Apply for a New Event</h1>
            {!applicationFinished && !applicationInProgress && 
                <form onSubmit={handleSubmit}>
                    <label>
                        Event Name (Star Name): <input required type="text" value={eventName} 
                            onChange={(event) => setEventName(event.target.value)}></input>
                    </label>
                    <label>
                        Event Date: <input required type="date" min="2024-05-20" max="2025-12-31"
                            value={eventDate} onChange={(event) => setEventDate(event.target.value)}></input>
                    </label>
                    <label>
                        Event Time: <input required type="time" value={eventTime} step="300"
                            onChange={(event) => setEventTime(event.target.value)}></input>
                    </label>
                    <label>
                        Event Location: <select name="eventLocation" required value={eventVenue}
                            onChange={(event) => setEventVenue(event.target.value)}>
                            <option value="" disabled>-- Select a Venue --</option>
                            <option value="HKC">Hong Kong Coliseum</option>
                            <option value="DIS">Hong Kong Disneyland</option>
                            <option value="AWE">Asia-World Expo</option>
                            <option value="CEN">Central Harbourfront Event Space</option>
                            <option value="HKS">Hong Kong Stadium</option>
                            <option value="KITEC">Star Hall, KITEC</option>
                        </select>
                    </label>
                    <label>
                        Seating Plan: <input required type="number" min="5" max="25" value={eventRows} 
                            onChange={(event) => setEventRows(event.target.value)}></input>
                            Rows x <input required type="number" min="10" max="20" value={eventCols} 
                            onChange={(event) => setEventCols(event.target.value)}></input>
                            Cols
                    </label>
                    <label>
                        Ticket maximum transfers: <input required type="number" min="0" max="5" 
                            value={eventTicketTransferLimit} 
                            onChange={(event) => setEventTicketTransferLimit(event.target.value)}></input>
                    </label>
                    <label>
                        Application type: 
                        <div className="form-options">
                            <span className="form-option">
                                <input required type="radio" name="application" value="auto"
                                    onChange={(event) => setApplicationType(event.target.value)}></input>
                                Automatic deployment via your Metamask wallet
                            </span>
                            <span className="form-option">
                                <input required type="radio" name="application" value="manual"
                                    onChange={(event) => setApplicationType(event.target.value)}></input>
                                Manual approval (takes up to 2 weeks)
                            </span>
                        </div>
                    </label>
                    <label>
                        Email address: <input required type="email" value={applicantEmail}
                            onChange={(event) => setApplicantEmail(event.target.value)}></input>
                    </label>
                    <button type="submit">Submit</button>
                </form>
            }
            {applicationFinished && isManualApplication && 
                <div className="application-success-manual">
                    <p>Your application is pending approval. </p>
                    <p>Please check your email regularly for updates. </p>
                </div>
            }
            {!applicationFinished && isAutoApplication && applicationInProgress && 
                <div className="application-in-progress">
                    <h3>Application in progress...</h3>
                    <h3>{applicationMessage}</h3>
                    <h3>Respond to the wallet prompts if needed. </h3>
                    <progress value={null}></progress>
                </div>
            }
            {applicationFinished && isAutoApplication && 
                <div className="application-success-auto">
                    <h3>Your application is successful. </h3>
                    <h4>Gas used for deployment: {deploymentGasUsed}</h4>
                    <h4>Please ensure that you have copied the contract address below. </h4>
                    <h4>Contract address: {deployedContractAddress ? deployedContractAddress : "unavailable"} 
                        {deployedContractAddress && 
                            <Clipboard textToCopy={deployedContractAddress} />
                        }
                    </h4>
                    <a href={`https://sepolia.etherscan.io/address/${deployedContractAddress}`} 
                        className="view-on-etherscan"
                        target="_blank" rel="noopener noreferrer">
                        View deployed contract on Etherscan
                    </a>
                    <br></br>
                    <a href={`https://sepolia.etherscan.io/tx/${deploymentTxHash}`} 
                        className="view-on-etherscan"
                        target="_blank" rel="noopener noreferrer">
                        View deployment transaction on Etherscan
                    </a>
                    <p>Please check your email regularly for updates. </p>
                </div>
            }
        </div>
    );
};


export default AdminEventApplicationPage;
