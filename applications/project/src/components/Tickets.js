import React from "react";
import {QRCodeCanvas} from 'qrcode.react';
import Web3 from "web3";


const ether = 10 ** 18;


const downloadQRCode = (ticketName) => {
    // set constant variables: define the enlarged QR code image size
    const qrCodeDownloadSize = 512;
    const paddingPixels = 32;

    // obtain the current canvas
    let qrCodeCanvas = document.querySelector(".ticket-qr-code canvas");

    // obtain the padded size
    let paddedSize = qrCodeDownloadSize + paddingPixels * 2;

    // create a new canvas with padding added 
    // (such that the QR code image is more readable and accessible)
    let paddedCanvas = document.createElement('canvas');
    paddedCanvas.width = paddedSize;
    paddedCanvas.height = paddedSize;
    let paddedCanvasContext = paddedCanvas.getContext('2d');

    // apply the padding and enlarged QR code on the new canvas
    paddedCanvasContext.fillStyle = 'white';
    paddedCanvasContext.fillRect(0, 0, paddedSize, paddedSize);
    paddedCanvasContext.drawImage(qrCodeCanvas, paddingPixels, paddingPixels, qrCodeDownloadSize, qrCodeDownloadSize);
    
    // create the download link for the new canvas (enlarged and padded QR code)
    let downloadLink = document.createElement('a');
    downloadLink.download = `${ticketName}.png`;
    downloadLink.href = paddedCanvas.toDataURL();
    downloadLink.click();
}


const Tickets = ({ tickets }) => {
    if (tickets.length > 0) {
        let ticket = tickets[0];
        let ticketName = `${ticket.eventName}_Seat_${ticket.seat}`;
        let qrCodeHashedString = Web3.utils.keccak256(JSON.stringify(ticket));

        return (
            <div className="ticket">
                <div className="ticket-left">
                    <h2 className="ticket-title">Ticket</h2>
                    <p className="ticket-info">Event Name: {ticket.eventName}</p>
                    <p className="ticket-info">Event Details: {ticket.eventDetails}</p>
                    <p className="ticket-info">Seat: {ticket.seat}</p>
                    <p className="ticket-info">Price: {ticket.price / ether} ether</p>
                    <p className="ticket-info">Transfer count: {ticket.transferCount}</p>
                </div>
                <div className="ticket-qr-code">
                    <QRCodeCanvas className="ticket-qr-code-canvas" value={qrCodeHashedString} 
                            size={128} level="M" />
                    <button className="ticket-qr-code-download-button" 
                            onClick={() => downloadQRCode(ticketName)}>Download QR Code</button>
                </div>
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
