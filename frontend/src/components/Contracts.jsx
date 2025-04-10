import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState(null);

  const handleAccept = async (action, contractId) => {
    const token = localStorage.getItem('agentToken');
    const body = {
      contractId: contractId,
      status: action, // Use the `action` parameter here
    };
  
    try {
      const response = await axios.post('http://localhost:3000/api/agent/contract', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log(response.data); // Corrected the console.log statement
  
      if (action === 'accept') {
        // Update the status of the accepted contract
        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.id === contractId ? { ...contract, status: 'accepted' } : contract
          )
        );
      } else if (action === 'reject') {
        // Remove the rejected contract from the list
        setContracts((prevContracts) =>
          prevContracts.filter((contract) => contract.id !== contractId)
        );
      }
    } catch (error) {
      console.error('Error updating contract status:', error);
    }
  };

  const fetchContracts = async () => {
    const token = localStorage.getItem('agentToken');
    try {
      const response = await axios.get('http://localhost:3000/api/agent/contract', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setContracts(response.data.contracts);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <div>
      <div className="flex items-center flex-col">
        <h1 className="text-3xl font-bold mb-4">Contracts</h1>
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="flex flex-col bg-yellow-300 p-4 m-4 rounded-2xl w-[60%] text-2xl"
          >
            <div>
              <h1><strong>Contract ID:</strong> {contract.id}</h1>
              <h1><strong>Contract Date:</strong> {new Date(contract.contract_date).toLocaleString()}</h1>
              <h1><strong>Contract Value:</strong> ${contract.contract_value}</h1>
              <h1><strong>Status:</strong> {contract.status}</h1>
              <h1><strong>Property ID:</strong> {contract.propertyId}</h1>
              <h1><strong>Client Name:</strong> {contract.client.name}</h1>
              <h1><strong>Client Email:</strong> {contract.client.email}</h1>
              <h1><strong>Client Phone:</strong> {contract.client.phone}</h1>
            </div>
            <div>
              <button
                className="bg-yellow-500 p-2 rounded-2xl font-bold mt-2"
                onClick={() => setSelectedPropertyDetails(contract)}
              >
                Show Property Details...
              </button>
              {selectedPropertyDetails && selectedPropertyDetails.id === contract.id && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-[80%] max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">Property Details</h2>
                    <p><strong>Property ID:</strong> {selectedPropertyDetails.propertyId}</p>
                    <p><strong>Property Name:</strong> {selectedPropertyDetails.property?.title || "N/A"}</p>
                    <p><strong>Location:</strong> {selectedPropertyDetails.property?.location || "N/A"}</p>
                    <p><strong>Property Price:</strong> ${selectedPropertyDetails.property?.price || "N/A"}</p>
                    <p><strong>Contract Value:</strong> ${selectedPropertyDetails.contract_value}</p>
                    <p><strong>Status:</strong> {selectedPropertyDetails.status}</p>
                    <button
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md"
                      onClick={() => setSelectedPropertyDetails(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-evenly text-2xl font-bold mt-2">
              {contract.status === 'accepted' ? (
                <button className="bg-gray-400 px-7 py-2 rounded-2xl" disabled>
                  Accepted
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAccept('accept', contract.id)}
                    className="bg-green-400 px-7 py-2 rounded-2xl"
                  >
                    Accept Proposal
                  </button>
                  <button
                    onClick={() => handleAccept('reject', contract.id)}
                    className="bg-red-500 px-7 py-2 rounded-2xl"
                  >
                    Reject Proposal
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contracts;