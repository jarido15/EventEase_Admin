import React, { useState, useEffect } from "react";
import { getDocs, collection, query } from "firebase/firestore";
import { db } from "./firebase";  // Import the db instance

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [groupedRatings, setGroupedRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const q = query(collection(db, "Ratings"));
        const querySnapshot = await getDocs(q);
        const ratingsData = [];

        querySnapshot.forEach((doc) => {
          ratingsData.push(doc.data());
        });

        setRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, []);

  useEffect(() => {
    if (ratings.length === 0) return;

    // Group ratings by serviceName, supplierName, and BusinessName
    const grouped = ratings.reduce((acc, rating) => {
      const key = `${rating.serviceName}-${rating.supplierName}-${rating.BusinessName}`;
      if (!acc[key]) {
        acc[key] = { ratings: [], serviceName: rating.serviceName, supplierName: rating.supplierName, BusinessName: rating.BusinessName };
      }
      acc[key].ratings.push(rating);
      return acc;
    }, {});

    // Convert grouped object into an array and calculate overall rating
    const groupedWithRatings = Object.keys(grouped).map((key) => {
      const group = grouped[key];
      const totalRating = group.ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const overallRating = (totalRating / group.ratings.length).toFixed(1);
      return { ...group, overallRating };
    });

    setGroupedRatings(groupedWithRatings);
  }, [ratings]);

  const toggleModal = (rating) => {
    setSelectedRating(rating);
    setShowModal(!showModal);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Customer Ratings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupedRatings.length === 0 ? (
          <div className="col-span-full text-center text-lg text-gray-500">
            No ratings available.
          </div>
        ) : (
          groupedRatings.map((group, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{group.serviceName}</h3>
                <p className="text-sm text-gray-600">{group.supplierName}</p>
                <p className="text-sm text-gray-500">{group.BusinessName}</p>

                <div className="flex items-center mt-4">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="ml-2 text-2xl font-semibold">{group.overallRating}</span>
                </div>

                <p className="mt-2 text-sm text-gray-500">Total Ratings: {group.ratings.length}</p>

                <button
                  onClick={() => toggleModal(group)}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Rating Details</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Service: <span className="font-semibold">{selectedRating.serviceName}</span></p>
              <p className="text-sm text-gray-600">Supplier: <span className="font-semibold">{selectedRating.supplierName}</span></p>
              <p className="text-sm text-gray-600">Business: <span className="font-semibold">{selectedRating.BusinessName}</span></p>
              <p className="text-sm text-gray-600">Overall Rating: <span className="font-semibold">{selectedRating.overallRating}</span></p>
              <p className="text-sm text-gray-600">Number of Ratings: <span className="font-semibold">{selectedRating.ratings.length}</span></p>
            </div>

            <h4 className="text-lg font-semibold mb-2">Individual Ratings:</h4>
            <ul className="space-y-4">
              {selectedRating.ratings.map((rating, index) => (
                <li key={index} className="border-b border-gray-300 pb-4">
                  <p className="text-sm text-gray-700">Rating: {rating.rating}</p>
                  <p className="text-sm text-gray-700">Comment: {rating.comment}</p>
                </li>
              ))}
            </ul>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ratings;
