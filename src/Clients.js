import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Import Firestore
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // Firestore functions
import { TrashIcon, EyeIcon } from '@heroicons/react/outline'; // Import Heroicons

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to display until data is fetched
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal visibility
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for view modal visibility
  const [clientToDelete, setClientToDelete] = useState(null); // State to hold the client to be deleted
  const [clientToView, setClientToView] = useState(null); // State to hold the client to be viewed

  // Fetch client data from Firestore
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Clients"));
        const clientList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(clientList); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchClients();
  }, []);

  // Handle delete client
  const handleDelete = async () => {
    if (clientToDelete) {
      try {
        const clientDoc = doc(db, "Clients", clientToDelete.id);
        await deleteDoc(clientDoc);
        alert("Client deleted.");
        setClients(clients.filter(client => client.id !== clientToDelete.id)); // Remove deleted client from the table
      } catch (error) {
        console.error("Error deleting client:", error);
      } finally {
        setIsDeleteModalOpen(false); // Close the modal after deletion
        setClientToDelete(null); // Clear the client to delete
      }
    }
  };

  // Open the delete confirmation modal
  const openDeleteModal = (client) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  // Close the delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null); // Reset client to delete
  };

  // Open the view client details modal
  const openViewModal = (client) => {
    setClientToView(client);
    setIsViewModalOpen(true);
  };

  // Close the view client details modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setClientToView(null); // Reset client to view
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Clients</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Full Name</th>
                <th className="border px-4 py-2 text-left">Address</th>
                <th className="border px-4 py-2 text-left">Mobile Number</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Created At</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map(client => (
                  <tr key={client.id}>
                    <td className="border px-4 py-2">{client.fullName}</td>
                    <td className="border px-4 py-2">{client.Address}</td>
                    <td className="border px-4 py-2">{client.mobileNumber}</td>
                    <td className="border px-4 py-2">{client.email}</td>
                    <td className="border px-4 py-2">{new Date(client.createdAt?.seconds * 1000).toLocaleDateString()}</td>
                    <td className="border px-4 py-2 flex space-x-2">
                      <button
                        className="p-2 bg-blue-600 text-white rounded"
                        onClick={() => openViewModal(client)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 bg-red-600 text-white rounded"
                        onClick={() => openDeleteModal(client)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center border px-4 py-2">No Clients Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Are you sure you want to delete this client?</h3>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Client Details Modal */}
      {isViewModalOpen && clientToView && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Client Details</h3>
            <div>
              <p><strong>Full Name:</strong> {clientToView.fullName}</p>
              <p><strong>Address:</strong> {clientToView.Address}</p>
              <p><strong>Mobile Number:</strong> {clientToView.mobileNumber}</p>
              <p><strong>Email:</strong> {clientToView.email}</p>
              <p><strong>Created At:</strong> {new Date(clientToView.createdAt?.seconds * 1000).toLocaleDateString()}</p>
            </div>
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={closeViewModal}
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

export default Clients;
