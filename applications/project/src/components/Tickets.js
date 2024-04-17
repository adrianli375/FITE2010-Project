import React from "react";


const ether = 10 ** 18;


const Tickets = ({ tickets }) => {
    if (tickets.length > 0) {
        let ticket = tickets[0];
        return (
            <div className="ticket">
                <h2 className="ticket-title">Ticket</h2>
                <p className="ticket-info">Event Name: {ticket.eventName}</p>
                <p className="ticket-info">Event Details: {ticket.eventDetails}</p>
                <p className="ticket-info">Seat: {ticket.seat}</p>
                <p className="ticket-info">Price: {ticket.price / ether} ether</p>
                <p className="ticket-info">Transfer count: {ticket.transferCount}</p>
            </div>
        );
    }
    else {
        return (
            <>
                <p className="tickets-loading">Loading tickets...</p>
            </>
        );
    }
};


export default Tickets;
