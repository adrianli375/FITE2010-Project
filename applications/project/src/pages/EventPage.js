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
                    <EventComponent eventLink="/event/booking"
                    eventStar="Panther Chan" eventTime="Apr 13 - 8:15PM" eventLocation="Star Hall, KITEC"
                    eventImgPath="/imgs/panther-chan.png"/>
                    <EventComponent eventLink="https://zh.wikipedia.org/zh-hk/%E6%B4%AA%E5%98%89%E8%B1%AA"
                    eventStar="Kaho Hung" eventTime="Apr 13 - 8:15PM" eventLocation="Hong Kong Coliseum"
                    eventImgPath="/imgs/kaho-hung.png" />
                    <EventComponent eventLink="https://www.facebook.com/CreamfieldsHongKong/"
                    eventStar="Creamfield HK" eventTime="Apr 14 - 5:00PM" eventLocation="Central Harbourfront Event Space"
                    eventImgPath="/imgs/creamfield-hk.png" />
                    <EventComponent eventLink="https://zh.wikipedia.org/zh-hk/%E4%B8%AD%E5%B9%B4%E5%A5%BD%E8%81%B2%E9%9F%B32"
                    eventStar="Midlife, Sing & Shine 2" eventTime="Jul 19 - 8:15PM" eventLocation="Hong Kong Coliseum"
                    eventImgPath="/imgs/midlife-sing-shine.png" />
                </div>
            </section>
        </div>
    );
};

export default EventPage;