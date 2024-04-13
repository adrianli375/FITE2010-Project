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
                Hong Kong, a bustling city with a multicultural population, hosts a range of concerts and music festivals every year. In the year
                2023, renowned global artists and groups such as DJ Alan Walker, BLACKPINK, Charlie Puth, and Jay Chou selected Hong Kong as
                one of their tour destinations. The prevailing ticketing systems employed for facilitating ticket sales and distribution of event tickets
                are plagued by inherent issues, particularly concerning rampant speculation. This pervasive problem adversely affects both Event
                Organizers and Ticket Purchasers, undermining the overall integrity of the process.
            </p>
            <h2 className="motivation-title">MOTIVATION</h2>
            <p className="motivation-text">
                Ticket scalping and fraud have detrimental effects on both Ticket Purchasers and Event Organizers. Ticket Purchasers are forced to yield to scalpers, leading to the purchase of overpriced tickets and the risk of acquiring counterfeit ones. Consequently, their enthusiasm for future events diminishes, posing a threat to the industry's sustainability. Event Organizers, on the other hand, suffer reputational damage as ticket scalping creates a negative perception among consumers, resulting in dissatisfaction with the event arrangements.
            </p>
            <h2 className="solution-title">SOLUTION</h2>
            <p className="solution-text">
                In order to address the issues mentioned above, our objective is to create a system that offers notable advancements and advantages in key areas, including: 1) Improved security, 2) Transparent and trustworthy
                processes, 3) Enhanced trustworthiness, 4) Increased management capabilities, and 5) Sustainability.
                By leveraging blockchain technology, we can provide a unique and secure method for purchasing tickets. This
                approach benefits both customers involved in transactions and organizers hosting events, resulting in heightened
                satisfaction and efficiency within a reliable environment. Therefore, it is crucial to establish a stronger and more
                secure framework to combat ticket scalping while also enhancing data privacy protection.
            </p>
        </div>
    </div>
  );
};

export default AboutPage;
