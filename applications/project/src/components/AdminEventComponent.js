import React from 'react';


const AdminEventComponent = ({eventStar, eventTime, eventLocation, eventImgPath}) => {
    return (
        <div className="event">
            <div className="event-text">
                <h3 className="event-title">{eventStar}</h3>
                <p className="event-details">{eventTime}</p>
                <p className="event-details">{eventLocation}</p>
            </div>
            <div className="event-image">
                <img src={eventImgPath} alt={eventStar} />
            </div>
        </div>
    );
};

export default AdminEventComponent;
