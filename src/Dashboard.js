import React, { useState, useEffect } from "react";
import { db, collection, getDocs, doc, deleteDoc, updateDoc } from "./firebase"; // Import Firestore functions
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faEye } from "@fortawesome/free-solid-svg-icons"; // Import icons

const Dashboard = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show while fetching data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [deleteId, setDeleteId] = useState(null); // Store the id of the item to be deleted
  const [viewDetails, setViewDetails] = useState(null); // Store the details of the item to be viewed

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supplierSnapshot = await getDocs(collection(db, "Supplier"));
        const supplierList = supplierSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSuppliers(supplierList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const handleApprove = async (id) => {
    try {
      const docRef = doc(db, "Supplier", id);
      await updateDoc(docRef, { accountStatus: "Approved" });
      alert("Supplier account approved.");
    } catch (error) {
      console.error("Error approving account: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "Supplier", deleteId);
      await deleteDoc(docRef);
      alert("Supplier account deleted.");
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting account: ", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setViewDetails(null);
  };

  const handleView = (id) => {
    const selectedItem = suppliers.find(supplier => supplier.id === id);
    setViewDetails(selectedItem);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">EventEase</h1>

      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Supplier Accounts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Account Status</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td className="border px-4 py-2">{supplier.id}</td>
                    <td className="border px-4 py-2">{supplier.supplierName}</td>
                    <td className="border px-4 py-2">{supplier.accountStatus}</td>
                    <td className="border px-4 py-2">{supplier.email}</td>
                    <td className="border px-4 py-2 flex space-x-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => handleApprove(supplier.id)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={() => handleDeleteClick(supplier.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => handleView(supplier.id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center border px-4 py-2">
                    No Suppliers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {viewDetails && showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Details for {viewDetails.supplierName}</h2>
            <p><strong>Email:</strong> {viewDetails.email}</p>
            <p><strong>Phone:</strong> {viewDetails.ContactNumber}</p>
            <p><strong>Business:</strong> {viewDetails.BusinessName}</p>
            <p><strong>Address:</strong> {viewDetails.Location}</p>
            <div className="flex space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && !viewDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Are you sure you want to delete this account?</h2>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;