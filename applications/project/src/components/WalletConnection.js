import React from 'react';
import { useState } from 'react';
import Web3 from 'web3';
import './styles_components.css';


// define constant variable - sepolia chain ID
const SepoliaChainId = 11155111;


function WalletConnection() {
    // set the default message
    let defaultMessage = 'No wallet address connected';

    // if the session storage contains the address, then render the address
    if (sessionStorage.getItem('walletAddress')) {
        let connectedAccount = sessionStorage.getItem('walletAddress');
        defaultMessage = `Your connected wallet address: \n ${connectedAccount}`;
    }

    const [connectedAccount, setConnectedAccount] = useState(defaultMessage);

    async function connectMetamask() {
        // check metamask is installed
        if (window.ethereum) {
          // instantiate Web3 with the injected provider
          const web3 = new Web3(window.ethereum);

          // need to ensure that the wallet is connected to the Sepolia testnet chain
          let connectedChainId = await web3.eth.getChainId();
          if (connectedChainId !== SepoliaChainId) {
            alert("Your wallet is not connected to the Sepolia Testnet!");
            return;
          }
    
          // request user to connect accounts (Metamask will prompt)
          await window.ethereum.request({ method: 'eth_requestAccounts' });
    
          // get the connected accounts
          const accounts = await web3.eth.getAccounts();
          let connectedAccount = accounts[0];
    
          // show the first connected account in the react page
          setConnectedAccount(`Your connected wallet address: \n ${connectedAccount}`);

          // set the address as session storage variable
          sessionStorage.setItem('walletAddress', connectedAccount)
        } else {
          alert('Please download metamask');
        }
    }

    async function disconnectMetamask() {
      if (window.ethereum) {
        // reset the connection
        await window.ethereum.request(
          { method: 'eth_requestAccounts' ,
            params: [{eth_accounts: {}}]}
        );

        // reset the display text in the connection component
        defaultMessage = 'No wallet address connected';
        setConnectedAccount(defaultMessage);

        // remove the item in session storage
        sessionStorage.removeItem('walletAddress');
      }
    }

      return (
        <div className="wallet-connection">
            <h1>Connect to your Metamask Wallet address</h1>
            <div className="button-container">
              {/* Button to trigger Metamask connection */}
              <button onClick={() => connectMetamask()}>Connect to Metamask</button>
              {/* Button to disconnect Metamask */}
              <button onClick={() => disconnectMetamask()}>Disconnect from Metamask</button>
            </div>
            <br></br>
            {/* Display the connected account */}
            <h2>{connectedAccount}</h2>
        </div>
    );
}

export default WalletConnection;
