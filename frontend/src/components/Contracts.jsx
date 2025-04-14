import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState(null);

  const handleAccept = async (action, contractId) => {
    const token = localStorage.getItem('agentToken');
    const body = {
      contractId: contractId,
      status: action,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/auth/agent/contract', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log(response.data);

      if (action === 'accept') {
        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.contractid === contractId
              ? { ...contract, status: 'accepted' }
              : contract
          )
        );
      } else if (action === 'reject') {
        setContracts((prevContracts) =>
          prevContracts.filter((contract) => contract.contractid !== contractId)
        );
        
        if (selectedPropertyDetails?.contractid === contractId) {
          setSelectedPropertyDetails(null);
        }
      }
    } catch (error) {
      console.error('Error updating contract status:', error);
    }
  };

  const fetchContracts = async () => {
    const token = localStorage.getItem('agentToken');
    try {
      const response = await axios.get('http://localhost:3000/api/auth/agent/contract', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log(response.data.contracts);
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
     key={contract.contractid}
     className="w-[80%] bg-gradient-to-br from-yellow-100 to-white border border-yellow-300 rounded-3xl shadow-xl p-8 m-6 space-y-6 transition hover:shadow-2xl"
   >
     {/* Header */}
     <div className="flex justify-between items-center">
       <h2 className="text-3xl font-bold text-yellow-700">Contract #{contract.contractid}</h2>
       <span
         className={`text-lg px-4 py-1 rounded-full font-semibold capitalize tracking-wide ${
           contract.status === 'accepted'
             ? 'bg-green-200 text-green-800'
             : contract.status === 'rejected'
             ? 'bg-red-200 text-red-700'
             : 'bg-yellow-200 text-yellow-800'
         }`}
       >
         {contract.status}
       </span>
     </div>
   
     {/* Info */}
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xl text-gray-800">
       <p><strong>📅 Date:</strong> {new Date(contract.contract_date).toLocaleString()}</p>
       <p><strong>💰 Value:</strong> ${contract.contract_value}</p>
       <p><strong>🏡 Property Name:</strong> {contract.title}</p>
       <p><strong>🙍 Client:</strong> {contract.client_name}</p>
       <p><strong>📧 CLient Email:</strong> {contract.client_email}</p>
       <p><strong>📞Client Phone:</strong> {contract.client_phone}</p>
     </div>
   
    
     <div className="text-center">
       <button
         onClick={() => setSelectedPropertyDetails(contract)}
         className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl text-xl font-semibold shadow-md transition duration-300"
       >
         🔍 View Property Details
       </button>
     </div>
   
  
     <div className="flex justify-center gap-6 pt-4">
       {contract.status === 'accepted' ? (
         <button
           disabled
           className="bg-gray-300 text-gray-600 px-6 py-2 rounded-xl font-bold text-xl cursor-not-allowed"
         >
           ✅ Accepted
         </button>
       ) : (
         <>
           <button
             onClick={() => handleAccept('accept', contract.contractid)}
             className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-bold text-xl transition"
           >
             ✅ Accept
           </button>
           <button
             onClick={() => handleAccept('reject', contract.contractid)}
             className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-xl transition"
           >
             ❌ Reject
           </button>
         </>
       )}
     </div>
   
     {/* Modal */}
     {selectedPropertyDetails?.contractid === contract.contractid && (
       <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
         <div className="bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-2xl space-y-6">
           <h3 className="text-3xl font-bold text-yellow-600 text-center">🏠 Property Details</h3>
           <div className="text-xl text-gray-800 space-y-2">
             <p><strong>ID:</strong> {selectedPropertyDetails.property_id}</p>
             <p><strong>Property Name:</strong> {selectedPropertyDetails.title || "N/A"}</p>
             <p><strong>Location:</strong> {selectedPropertyDetails.location || "N/A"}</p>
             <p><strong>Price:</strong> ${selectedPropertyDetails.price || "N/A"}</p>
             <p><strong>Status:</strong> {selectedPropertyDetails.status}</p>
           </div>
           <button
             onClick={() => setSelectedPropertyDetails(null)}
             className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-xl font-semibold transition"
           >
             Close
           </button>
         </div>
       </div>
     )}
   </div>
   
        ))}
        {contracts.length === 0 && (
          <ErrorBoundary>
            <h1 className="text-2xl">No contracts found</h1>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default Contracts;
