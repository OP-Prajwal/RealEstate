import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ClientProperties = () => {
    const [location, setLocation] = useState('');
    const [bathroom, setBathroom] = useState(0);
    const [bedroom, setBedroom] = useState(0);
    const [properties, setProperties] = useState([]);
    const [disabledButtons, setDisabledButtons] = useState({});

    const handlesubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('clientToken');
    
        if (!token) {
            toast.error("Please login first");
            return;
        }
    
        try {
            console.log({ location, bedroom, bathroom })
            const response = await axios({
                method: 'get',
                url: 'http://localhost:3000/api/auth/client/getProperty',
                params: {
                    location,
                   bathroom: Number(bathroom),
                    bedroom:Number(bedroom)
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("RAW Response:", response);
            console.log("DATA:", response.data);
            console.log("PROPERTIES:", response.data.sortedProperties);
            
            if (response.data && Array.isArray(response.data.sortedProperties)) {
                
                setProperties(response.data.sortedProperties);
                
            }
    
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast.error(error.response?.data?.message || "Error fetching properties");
        }
        
    };

    const handleIntrest = async (propertyId) => {
        const token = localStorage.getItem('clientToken');
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            console.log(propertyId)
            await axios.post("http://localhost:3000/api/auth/client/showInterest",
                { propertyId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            setDisabledButtons((prev) => ({ ...prev, [propertyId]: true }));

            // Remove the property from the list
            setProperties(prevProperties =>
                prevProperties.filter((property) => property.id !== propertyId)
            );

        } catch (error) {
            if (error.response?.status === 401) {
                console.error("Authentication failed. Please login again.");
                localStorage.removeItem('clientToken');
            } else {
                console.error("Error showing interest:", error.response?.data?.message || error.message);
            }
        }
    };

    useEffect(() => {
        console.log("Properties updated:", properties);
    }, [properties]);

    return (
        <div className="p-2">
          <div className="bg-blue-100 shadow-md rounded-2xl p-6 w-full">
  <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Search Properties</h2>

  <form
    onSubmit={handlesubmit}
    className="grid grid-cols-1 md:grid-cols-4 gap-4 font-medium"
  >
    <div className="flex flex-col">
      <label htmlFor="location" className="text-lg text-blue-900 mb-2">Location</label>
      <input
        id="location"
        className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        type="text"
        placeholder="e.g. New York"
        onChange={(e) => setLocation(e.target.value)}
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor="bedrooms" className="text-lg text-blue-900 mb-2">Bedrooms</label>
      <input
        id="bedrooms"
        className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        type="number"
        placeholder="e.g. 2"
        onChange={(e) => setBedroom(Number(e.target.value))}
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor="bathrooms" className="text-lg text-blue-900 mb-2">Bathrooms</label>
      <input
        id="bathrooms"
        className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        type="number"
        placeholder="e.g. 1"
        onChange={(e) => setBathroom(Number(e.target.value))}
      />
    </div>

    <div className="flex items-end">
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold py-3 rounded-md text-lg"
      >
        Search
      </button>
    </div>
  </form>
</div>


            <div className='flex flex-col items-center gap-2'>
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <div
                        key={property.id}
                        className="bg-blue-100 w-[60%] text-xl rounded-2xl mt-4 p-4 flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 "
                      >
                        <h1 className="text-2xl font-semibold text-blue-800 mb-2">
                          Property Name: <span className="font-normal text-gray-600">{property.title || "N/A"}</span>
                        </h1>
                        <h1 className="text-lg text-blue-700 mb-2">
                          Location: <span className="font-normal text-gray-500">{property.location || "N/A"}</span>
                        </h1>
                        <h1 className="text-lg text-blue-700 mb-2">
                          Bedrooms: <span className="font-normal text-gray-500">{property.bedroom || "N/A"}</span>
                        </h1>
                        <h1 className="text-lg text-blue-700 mb-2">
                          Bathrooms: <span className="font-normal text-gray-500">{property.bathroom || "N/A"}</span>
                        </h1>
                        <h1 className="text-lg text-blue-700 mb-4">
                          Amenities: <span className="font-normal text-gray-500">{property.amenities || "N/A"}</span>
                        </h1>
                      
                        <button
                          className={`rounded-2xl px-6 py-2 text-xl font-semibold w-full transition-colors duration-300 ${
                            disabledButtons[property.id]
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                          onClick={() => handleIntrest(property.id)}
                          disabled={disabledButtons[property.id]}
                        >
                          {disabledButtons[property.id] ? "Registered" : "Show Interest"}
                        </button>
                      </div>
                      
                      
                    ))
                ) : (
                    <div className='text-center mt-4'>No properties found</div>
                )}
            </div>
        </div>
    );
};

export default ClientProperties;
