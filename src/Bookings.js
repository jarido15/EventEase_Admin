import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // Assuming you have set up Firebase properly
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchBookingsAndClients = async () => {
      try {
        // Get only bookings with status "Pending"
        const bookingsQuery = query(
          collection(db, "Bookings"),
          where("status", "==", "Pending")
        );
        
        // Real-time listener for bookings collection
        const unsubscribeBookings = onSnapshot(bookingsQuery, (querySnapshot) => {
          const bookingsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBookings(bookingsList);
        });

        // Real-time listener for clients collection
        const unsubscribeClients = onSnapshot(collection(db, "Clients"), (querySnapshot) => {
          const clientsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setClients(clientsList);
        });

        // Clean up listeners on component unmount
        return () => {
          unsubscribeBookings();
          unsubscribeClients();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBookingsAndClients();
  }, []);

  const getClientNameByUid = (uid) => {
    const client = clients.find(client => client.uid === uid);
    return client ? client.fullName : "Client Not Found";
  };

  // Function to update the status of a booking to "Cancelled"
  const cancelBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, "Bookings", bookingId);
      await updateDoc(bookingRef, {
        status: "Cancelled",
      });

      // Update local state to reflect the cancellation without needing a page refresh
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "Cancelled" } : booking
        )
      );
      alert("Booking has been cancelled.");
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-xl text-center text-gray-500">No bookings yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl duration-300"
            >
              {booking.imageUrl && (
                <img
                  src={booking.imageUrl}
                  alt={booking.serviceName}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{booking.serviceName}</h3>
                <p className="text-gray-600 text-lg mb-2">Supplier: <span className="font-medium">{booking.supplierName}</span></p>
                <p className="text-gray-600 text-lg mb-2">Location: <span className="font-medium">{booking.location}</span></p>
                <p className="text-gray-600 text-lg mb-2">Event Place: <span className="font-medium">{booking.eventPlace}</span></p>
                <p className="text-gray-600 text-lg mb-2">Event Type: <span className="font-medium">{booking.venueType}</span></p>
                <p className="text-gray-600 text-lg mb-2">Event Time: <span className="font-medium">{booking.eventTime}</span></p>
                <p className="text-gray-600 text-lg mb-2">Event Duration: <span className="font-medium">{booking.eventDuration}</span></p>
                <p className="text-gray-600 text-lg mb-2">Event Date: <span className="font-medium">{booking.eventDate}</span></p>
                <p className="text-gray-600 text-lg mb-2">Event Name: <span className="font-medium">{booking.eventName}</span></p>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-gray-900">Service Price: <span className="text-green-500">₱{booking.servicePrice}</span></p>
                  <p className="text-lg text-gray-700">Client: {getClientNameByUid(booking.uid)}</p>
                </div>
                {booking.status !== "Cancelled" && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none"
                  >
                    Cancel Booking
                  </button>
                )}
                {booking.status === "Cancelled" && (
                  <p className="text-red-500 font-semibold mt-4">Status: Cancelled</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
