import React, { useState, useEffect } from "react";
import { db, collection, getDocs, doc, deleteDoc, updateDoc } from "./firebase"; // Import Firestore functions
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faEye} from "@fortawesome/free-solid-svg-icons"; // Import icons

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("supplier"); // Default tab is 'supplier'
  const [suppliers, setSuppliers] = useState([]);
  const [planners, setPlanners] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show while fetching data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [deleteId, setDeleteId] = useState(null); // Store the id of the item to be deleted
  const [deleteType, setDeleteType] = useState(""); // Store the type (Supplier or Planner) to be deleted
  const [viewDetails, setViewDetails] = useState(null); // Store the details of the item to be viewed
  const [viewType, setViewType] = useState(""); // Store the type (Supplier or Planner) to differentiate fields

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === "supplier") {
          const supplierSnapshot = await getDocs(collection(db, "Supplier"));
          const supplierList = supplierSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSuppliers(supplierList);
        } else if (activeTab === "planner") {
          const plannerSnapshot = await getDocs(collection(db, "Planner"));
          const plannerList = plannerSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPlanners(plannerList);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]); // Re-run effect if tab changes

  const handleApprove = async (id, type) => {
    try {
      const docRef = doc(db, type, id);
      await updateDoc(docRef, { accountStatus: "Approved" });
      alert(`${type} account approved.`);
    } catch (error) {
      console.error("Error approving account: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, deleteType, deleteId);
      await deleteDoc(docRef);
      alert(`${deleteType} account deleted.`);
      setShowModal(false); // Close the modal after delete
    } catch (error) {
      console.error("Error deleting account: ", error);
    }
  };

  const handleDeleteClick = (id, type) => {
    setDeleteId(id);
    setDeleteType(type);
    setShowModal(true); // Show the confirmation modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal without deleting
    setViewDetails(null); // Reset view details when closing modal
    setViewType(""); // Reset the type when closing the modal
  };

  const handleView = (id, type) => {
    setViewType(type); // Set the type (Supplier or Planner)

    const selectedItem = type === "Supplier" ? 
      suppliers.find(supplier => supplier.id === id) : 
      planners.find(planner => planner.id === id);
  
    setViewDetails(selectedItem); // Set the selected item's details
    setShowModal(true); // Show the details modal
  };

  return (
    <div className="flex">
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start min-h-screen bg-white p-6">
        <h1 className="text-2xl font-bold mb-6">EventEase</h1>

        {/* Tabs for Supplier Request and Planner Request */}
        <div className="mb-6 flex space-x-4">
          <button
            className={`px-4 py-2 text-white rounded ${activeTab === "supplier" ? "bg-blue-600" : "bg-gray-600"}`}
            onClick={() => setActiveTab("supplier")}
          >
            Supplier Accounts
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${activeTab === "planner" ? "bg-blue-600" : "bg-gray-600"}`}
            onClick={() => setActiveTab("planner")}
          >
            Planner Accounts
          </button>
        </div>

        {/* Conditional Rendering of Tables */}
        {activeTab === "supplier" ? (
          <div className="w-full overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Supplier Account</h2>
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
                            onClick={() => handleApprove(supplier.id, "Supplier")}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded"
                            onClick={() => handleDeleteClick(supplier.id, "Supplier")}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                            onClick={() => handleView(supplier.id, "Supplier")}
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
        ) : (
          <div className="w-full overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Planner Account</h2>
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
                  {planners.length > 0 ? (
                    planners.map((planner) => (
                      <tr key={planner.id}>
                        <td className="border px-4 py-2">{planner.id}</td>
                        <td className="border px-4 py-2">{planner.fullName}</td>
                        <td className="border px-4 py-2">{planner.accountStatus}</td>
                        <td className="border px-4 py-2">{planner.email}</td>
                        <td className="border px-4 py-2 flex space-x-2">
                          <button
                            className="px-3 py-1 bg-green-600 text-white rounded"
                            onClick={() => handleApprove(planner.id, "Planner")}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>
                          <button
                            className="px-3 py-1 bg-red-600 text-white rounded"
                            onClick={() => handleDeleteClick(planner.id, "Planner")}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                            onClick={() => handleView(planner.id, "Planner")}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center border px-4 py-2">
                        No Planners Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* View Details Modal for Supplier */}
      {viewDetails && showModal && viewType === "Supplier" && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Details for {viewDetails.supplierName}</h2>
            <p><strong>Email:</strong> {viewDetails.email}</p>
            <p><strong>Phone:</strong> {viewDetails.ContactNumber}</p>
            <p><strong>Business:</strong> {viewDetails.BusinessName}</p>
            <p><strong>Address:</strong> {viewDetails.Address}</p>
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

      {/* View Details Modal for Planner */}
      {viewDetails && showModal && viewType === "Planner" && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl mb-4">Details for {viewDetails.fullName}</h2>
            <p><strong>Email:</strong> {viewDetails.email}</p>

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

      {/* Delete Confirmation Modal */}
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
