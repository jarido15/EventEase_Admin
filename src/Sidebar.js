import React from "react";
import { Link } from "react-router-dom"; // For navigation to different routes
import { HomeIcon, ClipboardListIcon, CreditCardIcon, StarIcon, UsersIcon, LogoutIcon } from "@heroicons/react/outline"; // Importing Heroicons

const Sidebar = () => {
  const handleLogout = () => {
    // Perform logout logic here (e.g., clear tokens, reset authentication state)
    // For example, clearing localStorage or sessionStorage
    localStorage.removeItem("authToken"); // Assuming authToken is stored in localStorage
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="h-screen bg-gray-800 text-white w-64 p-4">
      {/* "EventEase Admin" Logo Link */}
      <Link to="/dashboard">
        <h2 className="text-2xl font-bold mb-8 text-center cursor-pointer hover:text-gray-400">
          EventEase Admin
        </h2>
      </Link>

      {/* Sidebar Menu */}
      <ul className="space-y-6">
      <li>
          <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded block flex items-center">
            <HomeIcon className="h-5 w-5 mr-2" /> {/* Change the icon to Home */}
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/bookings" className="hover:bg-gray-700 p-2 rounded block flex items-center">
            <ClipboardListIcon className="h-5 w-5 mr-2" />
            Bookings
          </Link>
        </li>
        <li>
          <Link to="/payment" className="hover:bg-gray-700 p-2 rounded block flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Payment
          </Link>
        </li>
        <li>
          <Link to="/ratings" className="hover:bg-gray-700 p-2 rounded block flex items-center">
            <StarIcon className="h-5 w-5 mr-2" />
            Ratings
          </Link>
        </li>
        <li>
          <Link to="/clients" className="hover:bg-gray-700 p-2 rounded block flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            Clients
          </Link>
        </li>

        {/* Logout */}
        <li>
          <button
            onClick={handleLogout}
            className="hover:bg-gray-700 p-2 rounded block flex items-center"
          >
            <LogoutIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
