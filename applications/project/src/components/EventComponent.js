import React from 'react';
import { Link } from 'react-router-dom';


const EventComponent = ({eventLink, eventStar, eventTime, eventLocation, eventImgPath}) => {
    return (
        <Link to={eventLink} className="event-link">
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
        </Link>
    );
};

export default EventComponent;
