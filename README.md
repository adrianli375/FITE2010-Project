# Project
This repository contains the course project code for the course [FITE2010 Distributed Ledger and Blockchain](https://cs.hku.hk/index.php/programmes/course-offered?infile=2023/fite2010.html), at the University of Hong Kong (HKU) in Spring 2024. 

This course project is conducted by a total of 5 students. 

# Project Stack
This sub-section outlines the tech stack used for the project. 

* Frontend: HTML, CSS, JavaScript (mainly using `web3.js` library for smart contract interaction), React
* Smart Contracts: Solidity (using remix IDE)
* Wallet: MetaMask


# Project Proposal
A project proposal is submitted to the course instructor for review with the details displayed below. 

## Introduction
Ticket counterfeiting, customer data leakage, and ticket price manipulation are all rising problems in today's concert ticketing situation. Customers often face unfair situations against ticket scalpers, withholding large amounts of tickets and raising them to unreasonable prices. On the other hand, providing personal and sensitive information to the ticketing system remains vulnerable to data leakage. To solve the aforementioned problems, we are implementing a blockchain-driven concert ticketing system. Each ticket will be represented as a unique digital asset on the blockchain, preventing counterfeiting, while smart contracts could further facilitate sales, transfers, and even set in parameters for fair pricing and validating ticket authenticity. In the following, we will explain further how each mechanism could be implemented.

## Business Problems Faced
1. **Ticket Counterfeiting**: Refers to the unauthorized replication or creation of fake tickets leading to fraudulent sales or unauthorised access. Currently, physical tickets or simple e-tickets lack unique digital signatures or key identifying marks that make them vulnerable to replication and fraud on the market. By representing tickets as unique digital assets on a blockchain, it gives them unique identifiers and proof that they are stored on a public ledger, making it difficult to tamper with or replicate tickets and providing a more secure and verifiable ticketing process.
2. **Ticket Price Manipulation**: Considering the popularity of different concerts, ticket scalpers and second-hand sellers often manipulate prices. These intermediaries, taking advantage of the lack of market availability and supply of tickets, raise ticket prices to unreasonable prices, leading to unfair pricing practices. Smart contracts allow ticket prices to be managed transparently and autonomously, also allowing us to set in particular parameters and functions in the smart contract to fix ticket prices to a predefined range and within set rules, ensuring fairness and preventing price manipulation.
3. **Digital Authentication**: Similar to the problem of counterfeiting, current tickets lack unique addresses, making it easy to replicate and hard to authenticate upon entry, leading to unauthorized access to the concerts. Digital authentication mechanism, such as cryptographic signatures or unique identifiers will be store on the blockchain, verifying the validity of tickets. 
4. **Customer Data Leakage**: Current centralised ticketing systems risk customer data being leaked or their servers being attacked. By storing customer data on the blockchain, we reduce the reliance on centralized databases. Blockchain possess the nature of being immutable and decentralized, enhancing data security and protecting customer information.

