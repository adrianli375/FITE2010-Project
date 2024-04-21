import React from 'react';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { contractAddress, contractABI } from '../const/SmartContract.js';
import convertNumberToLetter from '../utils/StringUtilFunctions.js';
import './styles_components.css';

const ether = 10 ** 18;

const EventSeatingPlan = (props) => {
    // defines the web3 object and smart contract object
    var web3 = undefined;
    var contract = undefined;

    // state variables
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [seatRows, setSeatRows] = useState(0);
    const [seatCols, setSeatCols] = useState(0);
    const [seatAvailability, setSeatAvailability] = useState({});
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatPrices, setSeatPrices] = useState({});
    const [selectedSeatPrice, setSelectedSeatPrice] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
        }
        getSeatingPlanAndPrices();
        renderSeats();
        props.parentCallback(selectedSeat, selectedSeatPrice, isLoading);
    }, [seatAvailability, seatPrices, selectedSeat, selectedSeatPrice]);


    async function getSeatRows() {
        if (window.ethereum) {
            let rows = await contract.methods.seatRows().call();
            setSeatRows(rows);
        }
    }

    async function getSeatCols() {
        if (window.ethereum) {
            let cols = await contract.methods.seatCols().call();
            setSeatCols(cols);
        }
    }

    async function getSeatingPlanAndPrices() {
        // obtains the seating plan and the price mapping from the smart contract
        getSeatRows().then().catch();
        getSeatCols().then().catch();
        let seatAvailability = {};
        let seatPrices = {};
        let counter = 0;
        let total = seatRows * seatCols;
        if (window.ethereum) {
            for (let i = 1; i <= seatRows; i++) {
                for (let j = 1; j <= seatCols; j++) {
                    let seat = `${convertNumberToLetter(i)}${j}`;
                    try {
                        await contract.methods.isSeatTaken(seat).call(
                            (err, res) => {
                                seatAvailability[seat] = !res;
                            }
                        );
                        await contract.methods.seatPrices(seat).call(
                            (err, res) => {
                                seatPrices[seat] = res;
                            }
                        );
                        counter++;
                        if (total > 0) {
                            setLoadingProgress(counter / total);
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
            // console.log(JSON.stringify(seatAvailability));
            setSeatAvailability(seatAvailability);
            // console.log(JSON.stringify(seatPrices));
            setSeatPrices(seatPrices);
            let loading = !(counter > 0);
            setIsLoading(loading);
        }
    }

    const handleSeatClick = async (event) => {
        // obtains the currently selected seat
        let seat = event.currentTarget.innerText;
        let existingSeat = selectedSeat;
        // console.log(seat);
        // if the existing seat selected is equal to the seat clicked, remove the styling
        if (seat === existingSeat) {
            document.getElementById(existingSeat).classList.remove('selected');
            setSelectedSeat(null);
            setSelectedSeatPrice(null);
        }
        // if the seat is available, do the following
        else if (seatAvailability[seat]) {
            if (existingSeat !== null) {
                // remove the styling of the old seat
                document.getElementById(existingSeat).classList.remove('selected');
            }
            // set the selected seat and update the styling of the new seat
            setSelectedSeat(seat);
            document.getElementById(seat).classList.add('selected');
            // obtain the price of the seat
            let prc = seatPrices[seat] / ether;
            setSelectedSeatPrice(`${prc} ether`);
            props.parentCallback(selectedSeat, selectedSeatPrice, isLoading);
        }
    };

    const renderSeats = () => {
        const seats = [];

        for (let row = 1; row <= seatRows; row++) {
            const rowSeats = [];

            for (let col = 1; col <= seatCols; col++) {
                const seatKey = `${convertNumberToLetter(row)}${col}`;
                const isAvailable = seatAvailability[seatKey];

                const seatStyle = {
                    backgroundColor: isAvailable ? '#A6F754' : '#E0362E',
                };

                let classNames = `seat${isAvailable ? " available" : ""}${seatKey === selectedSeat ? " selected" : ""}`

                rowSeats.push(
                <div key={seatKey} style={seatStyle} className={classNames} id={seatKey}
                occupied={`${!isAvailable}`} cursor={isAvailable ? "pointer" : "not-allowed"}
                onClick={isAvailable ? handleSeatClick : () => {}}>
                    {seatKey}
                </div>
                );
            }

            seats.push(<div key={`row-${row}`} className="seat-row">{rowSeats}</div>);
        }

        return seats;
    };

    return (
        <div className="seating-plan-container">
            {/* <div className="seating-plan-refresh">
                <button onClick={renderSeats}>Refresh Seating Plan</button>
            </div> */}
            {isLoading ? 
                <div className="seating-plan">
                    <h2>Loading seating plan...</h2>
                    <progress value={loadingProgress}></progress>
                </div>
                :
                <div className="seating-plan">
                    <h2>Seating Plan</h2>
                    {renderSeats()}
                </div>
            }
        </div>
    );
};

export default EventSeatingPlan;
