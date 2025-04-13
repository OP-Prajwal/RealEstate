import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientRegisterations = () => {
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState(null);

  const getAllInterests = async () => {
    const token = localStorage.getItem('clientToken');

    if (!token) {
      setError("No token found. Please login again.");
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/auth/client/allinterest', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data) {
        setInterests(response.data.allInterests || []);
      }
    } catch (err) {
      console.error("Error fetching interests:", err);
      setError("Failed to fetch registered properties. Please try again later.");
    }
  };

  useEffect(() => {
    try {
      getAllInterests();
    } catch (err) {
      setError("Something went wrong during loading. Try again later.");
    }
  }, []);

  // Wrapping the rendering logic in try-catch style
  try {
    if (error) {
      return (
        <div className="p-4 text-center text-red-500">
          <h1 className="text-2xl font-bold">Error</h1>
          <p>{error}</p>
        </div>
      );
    }

    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold text-center mb-6 items-center">Registered Properties</h1>
        <div className="space-y-4 items-center flex  flex-col">
          {interests.length > 0 ? (
            interests.map((interest, index) => (
              <div
              key={index}
              className="bg-white shadow-md hover:shadow-lg rounded-lg p-6 w-[80%] text-2xl border mt-4 border-gray-200 transition-all duration-300 transform hover:scale-102"
            >
              <div className="grid grid-cols-1 gap-4 text-2xl">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                    Property: {interest.title || 'N/A'}
                  </h2>
                  <p className="text-xl text-gray-600">
                    <span className="font-medium">Agent:</span> {interest.name || 'N/A'}
                  </p>
                  <p className="text-xl text-gray-600">
                    <span className="font-medium">Location:</span> {interest.location || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xl text-gray-600 mb-1">
                    <span className="font-medium">Price:</span> ${interest.price || 'N/A'}
                  </p>
                  <p className="text-xl text-gray-600 mb-1">
                    <span className="font-medium">Bedrooms:</span> {interest.bedroom || 'N/A'}
                  </p>
                  <p className="text-xl text-gray-600">
                    <span className="font-medium">Bathrooms:</span> {interest.bathroom || 'N/A'}
                  </p>
                </div>
              </div>
            
              <div className="flex justify-center mt-4">
                <div className="bg-white rounded-lg p-3 w-full">
                  <h3 className="text-xl font-semibold mb-2 text-gray-700 text-center">
                    Property Status
                  </h3>
                  <div
                    className={`px-4 py-2 rounded-full font-medium text-center text-3xl ${
                      interest.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        : interest.status === 'accepted'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : interest.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {interest.status
                      ? interest.status.charAt(0).toUpperCase() + interest.status.slice(1).toLowerCase()
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            
            

            ))
          ) : (
            <div className="text-center text-gray-500 text-xl">
              No registered properties found
            </div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("Render error:", err);
    return (
      <div className="p-4 text-center text-red-500">
        <h1 className="text-2xl font-bold">Oops!</h1>
        <p>Something went wrong while rendering properties.</p>
      </div>
    );
  }
};

export default ClientRegisterations;
