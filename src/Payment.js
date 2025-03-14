import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // Assuming you have set up Firebase properly
import { getDocs, collection } from "firebase/firestore";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchPaymentsAndClients = async () => {
      try {
        // Fetching Payments collection
        const paymentsSnapshot = await getDocs(collection(db, "Payments"));
        const paymentsList = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetching Clients collection
        const clientsSnapshot = await getDocs(collection(db, "Clients"));
        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPayments(paymentsList);
        setClients(clientsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPaymentsAndClients();
  }, []);

  // Function to get client full name by matching userId in Payments with Client's doc id
  const getClientNameByUserId = (userId) => {
    const client = clients.find(client => client.id === userId);
    return client ? client.fullName : "Client Not Found";
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Payments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl duration-300">
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{payment.serviceName}</h3>
              <p className="text-gray-600 text-lg mb-2">Supplier: <span className="font-medium">{payment.supplierName}</span></p>
              <p className="text-gray-600 text-lg mb-2">Amount Paid: <span className="font-medium">₱{payment.amountPaid}</span></p>
              <p className="text-gray-600 text-lg mb-2">Service Price: <span className="font-medium">₱{payment.servicePrice}</span></p>
              <p className="text-gray-600 text-lg mb-2">Reference Number: <span className="font-medium">{payment.referenceNumber}</span></p>
              <p className="text-gray-600 text-lg mb-2">Payment Timestamp: <span className="font-medium">{new Date(payment.timestamp.seconds * 1000).toLocaleString()}</span></p>
              <p className="text-gray-600 text-lg mb-2">Client: <span className="font-medium">{getClientNameByUserId(payment.userId)}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payment;
