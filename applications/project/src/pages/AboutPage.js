import React from 'react';
import './styles.css';
import CustomHeader from '../components/Header.js';


const AboutPage = () => {
    return (
        <div className="about-page">
            <CustomHeader />
            <div className="about-text">
                <h1 className="about-title">ABOUT</h1>
                <h2 className="introduction-title">INTRODUCTION</h2>
                <p className="introduction-text">
                    Ticket counterfeiting, customer data leakage, and ticket price manipulation 
                    are all rising problems in today's concert ticketing situation. 
                    Customers often face unfair situations against ticket scalpers, 
                    withholding large amounts of tickets and raising them to unreasonable prices. 
                    On the other hand, providing personal and sensitive information to the ticketing system 
                    remains vulnerable to data leakage. To solve the aforementioned problems, 
                    we are implementing a blockchain-driven concert ticketing system. 
                    Each ticket will be represented as a unique digital asset on the blockchain, 
                    preventing counterfeiting, while smart contracts could further facilitate sales, 
                    transfers, and even set in parameters for fair pricing and validating ticket 
                    authenticity. In the following, we will explain further how each mechanism could be implemented.
                </p>
                <h2 className="problem-title">PROBLEMS FACED</h2>
                <ol className="problems">
                    <li className="problem">
                        <p className="problem-text"><strong>Ticket Counterfeiting: </strong>
                            Refers to the unauthorized replication or creation of fake tickets leading to fraudulent sales 
                            or unauthorised access. Currently, physical tickets or simple e-tickets lack unique digital signatures 
                            or key identifying marks that make them vulnerable to replication and fraud on the market. 
                            By representing tickets as unique digital assets on a blockchain, it gives them unique identifiers 
                            and proof that they are stored on a public ledger, making it difficult to tamper with or replicate tickets 
                            and providing a more secure and verifiable ticketing process.
                        </p>
                    </li>
                    <li className="problem">
                        <p className="problem-text"><strong>Ticket Price Manipulation: </strong>
                            Considering the popularity of different concerts, ticket scalpers and second-hand sellers 
                            often manipulate prices. These intermediaries, taking advantage of the lack of market 
                            availability and supply of tickets, raise ticket prices to unreasonable prices, 
                            leading to unfair pricing practices. Smart contracts allow ticket prices to be 
                            managed transparently and autonomously, also allowing us to set in particular parameters 
                            and functions in the smart contract to fix ticket prices to a predefined range and 
                            within set rules, ensuring fairness and preventing price manipulation.
                        </p>
                    </li>
                    <li className="problem">
                        <p className="problem-text"><strong>Digital Authentication: </strong>
                            Similar to the problem of counterfeiting, current tickets lack unique addresses, 
                            making it easy to replicate and hard to authenticate upon entry, leading to unauthorized 
                            access to the concerts. Digital authentication mechanism, such as cryptographic signatures 
                            or unique identifiers will be store on the blockchain, verifying the validity of tickets.
                        </p>
                    </li>
                    <li className="problem">
                        <p className="problem-text"><strong>Customer Data Leakage: </strong>
                            Current centralised ticketing systems risk customer data being leaked or 
                            their servers being attacked. By storing customer data on the blockchain, 
                            we reduce the reliance on centralized databases. Blockchain possess the nature 
                            of being immutable and decentralized, enhancing data security and protecting customer information.
                        </p>
                    </li>
                </ol>
                <h2 className="solution-title">SOLUTION</h2>
                <p>
                    We have implemented a blockchain-based ticketing system, 
                    and the tickets have the following characteristics and advantages: 
                </p>
                <ol className="solutions">
                    <li className="solution">
                        <p className="solution-text"><strong>Digital authentication: </strong>
                            The ticket has a QR code generated, which is based on the hash of the ticket data 
                            (converted from json to str) and the wallet address of the ticket. This ensures 
                            authenticity when checking the identity of the ticket and its owner.
                        </p>
                    </li>
                    <li className="solution">
                        <p className="solution-text"><strong>Limited maximum transfers: </strong>
                            This ticket is designed based on the code and rules defined in a smart contract. 
                            The maximum number of ticket transfers are limited, so that the issue of ticket 
                            counterfeiting can be addressed, as manipulation in the ticket will not give a valid authenticity.
                        </p>
                    </li>
                    <li className="solution">
                        <p className="solution-text"><strong>Random NFT Generation: </strong>
                        For each event, there are a set of specific NFTs to be minted. 
                        The choice of the NFT is random and is not depending on the block hash and other block metadata. 
                        This randomized choice is performed off-chain on the frontend script.
                        </p>
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default AboutPage;
