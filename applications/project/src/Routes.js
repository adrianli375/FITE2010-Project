import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage.js';
import EventPage from './pages/EventPage.js';
import EventBookingPage from './pages/EventBookingPage.js';
import PaymentPage from './pages/PaymentPage.js';
import AboutPage from './pages/AboutPage.js';
import AdminHomePage from './pages/AdminHomePage.js';
import AdminLoginPage from './pages/AdminLoginPage.js';
import AdminEventPage from './pages/AdminEventPage.js';
import LoginErrorPage from './pages/LoginErrorPage.js';
import InvalidInputPage from './pages/InvalidInputPage.js';
import NotFoundPage from './pages/NotFoundPage.js';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={HomePage} />
        <Route exact path="/event" Component={EventPage} />
        <Route exact path="/event/booking" Component={EventBookingPage} />
        <Route exact path="/event/payment" Component={PaymentPage} />
        <Route exact path="/about" Component={AboutPage} />
        <Route exact path="/admin" Component={AdminHomePage} />
        <Route exact path="/admin/login" Component={AdminLoginPage} />
        <Route exact path="/admin/events" Component={AdminEventPage} />
        <Route exact path="/login-error" Component={LoginErrorPage} />
        <Route exact path="/invalid-input" Component={InvalidInputPage} />
        <Route path="*" Component={NotFoundPage} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;