import React from 'react';
import { useNavigate } from 'react-router-dom';


const EventComponent = ({eventLink, eventId, eventStar, eventTime, eventLocation, eventImgPath}) => {
    
    // define navigate function
    const navigate = useNavigate();
    
    const navigateToBooking = () => {
        navigate(eventLink, {replace: true, state: {
            eventId: eventId
        }});
    };
    
    return (
        <div className="event event-link" onClick={navigateToBooking}>
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

export default EventComponent;
