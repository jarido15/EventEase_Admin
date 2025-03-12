import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Bookings from "./Bookings";
import Payment from "./Payment";
import Ratings from "./Ratings";
import Clients from "./Clients";
import Login from "./Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in (from localStorage) when the app loads
  useEffect(() => {
    const userStatus = localStorage.getItem("isLoggedIn");
    if (userStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
        />
         <Route
          path="/clients"
          element={isLoggedIn ? <Layout><Clients /></Layout> : <Navigate to="/clients" />}
        />
        <Route
          path="/bookings"
          element={isLoggedIn ? <Layout><Bookings /></Layout> : <Navigate to="/login" />}
        />
         <Route
          path="/ratings"
          element={isLoggedIn ? <Layout><Ratings /></Layout> : <Navigate to="/ratings" />}
        />
        <Route
          path="/payment"
          element={isLoggedIn ? <Layout><Payment /></Layout> : <Navigate to="/login" />}
        />
        {/* Add more protected routes as necessary */}
      </Routes>
    </Router>
  );
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default App;
