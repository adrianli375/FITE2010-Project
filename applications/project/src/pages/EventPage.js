import React from 'react';
import './styles.css';
import CustomHeader from '../components/Header.js';
import EventComponent from '../components/EventComponent.js';
import WalletConnection from '../components/WalletConnection.js';

const EventPage = () => {
    return (
        <div className="event-container">
            <CustomHeader />
            <br></br>
            <br></br>
            <WalletConnection />
            <section id="events" className="section">
                <h1>Explore Upcoming Events in Hong Kong</h1>
                <div className="events">
                    <EventComponent eventLink="/event/booking" eventId={1}
                    eventStar="Panther Chan" eventTime="Apr 13 - 8:15PM" eventLocation="Star Hall, KITEC"
                    eventImgPath="/imgs/panther-chan.png"/>
                    <EventComponent eventLink="/event/booking" eventId={2}
                    eventStar="Kaho Hung" eventTime="Apr 13 - 8:15PM" eventLocation="Hong Kong Coliseum"
                    eventImgPath="/imgs/kaho-hung.png" />
                    <EventComponent eventLink="/event/booking" eventId={3}
                    eventStar="Creamfield HK" eventTime="Apr 14 - 5:00PM" eventLocation="Central Harbourfront Event Space"
                    eventImgPath="/imgs/creamfield-hk.png" />
                    <EventComponent eventLink="/event/booking" eventId={4}
                    eventStar="Midlife, Sing & Shine 2" eventTime="Jul 19 - 8:15PM" eventLocation="Hong Kong Coliseum"
                    eventImgPath="/imgs/midlife-sing-shine.png" />
                </div>
            </section>
        </div>
    );
};

export default EventPage;