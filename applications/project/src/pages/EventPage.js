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
                    {/* original link: https://zh.wikipedia.org/zh-hk/%E7%82%8E%E6%98%8E%E7%86%B9 */}
                    <EventComponent eventLink="/event/booking"
                    eventStar="Gigi Yim" eventTime="Apr 13 - 8:15PM" eventLocation="Star Hall, KITEC"
                    eventImgPath="/imgs/gigi-yim.png"/>
                    <EventComponent eventLink="https://zh.wikipedia.org/zh-hk/%E6%B4%AA%E5%98%89%E8%B1%AA"
                    eventStar="Kaho Hung" eventTime="Apr 13 - 8:15PM" eventLocation="Hong Kong Coliseum"
                    eventImgPath="/imgs/kaho-hung.png" />
                    <EventComponent eventLink="https://zh.wikipedia.org/zh-hk/%E9%84%AD%E7%A7%80%E6%96%87"
                    eventStar="Sammi Cheng" eventTime="Jul 19 - 8:15PM" eventLocation="Hong Kong Coliseum"
                    eventImgPath="/imgs/sammi-cheng.png" />
                </div>
            </section>
        </div>
    );
};

export default EventPage;