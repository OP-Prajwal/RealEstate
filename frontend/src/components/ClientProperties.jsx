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
            console.error("No token found");
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:3000/api/client/Property', {
                params: {
                    location,
                    bathroom,
                    bedroom
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
    
            console.log(response.data.properties);
            // ✅ Update this based on your backend response structure
            if (response.data && response.data.properties) {
                setProperties(response.data.properties);
            }
    
        } catch (error) {
            if (error.response?.status === 401) {
                console.error("Authentication failed. Please login again.");
                localStorage.removeItem('clientToken');
            } else {
                console.error("Error fetching properties:", error.response?.data?.message || error.message);
            }
            setProperties([]);
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
            await axios.post("http://localhost:3000/api/client/Property",
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
            <div className="bg-blue-100 shadow-sm rounded-md p-4">
                <h2 className="text-3xl font-semibold text-center mb-2">Search Properties</h2>
                <form
                    onSubmit={handlesubmit}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-bold"
                >
                    <div className="flex flex-col">
                        <label htmlFor="location" className="text-2xl mb-1">Location</label>
                        <input
                            id="location"
                            className="p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            type="text"
                            placeholder="Location"
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="bedrooms" className="text-2xl mb-1">Bedrooms</label>
                        <input
                            id="bedrooms"
                            className="p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            type="number"
                            placeholder="Bedrooms"
                            onChange={(e) => setBedroom(Number(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="bathrooms" className="text-2xl mb-1">Bathrooms</label>
                        <input
                            id="bathrooms"
                            className="p-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            type="number"
                            placeholder="Bathrooms"
                            onChange={(e) => setBathroom(Number(e.target.value))}
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="bg-blue-500 w-25 px-2 text-white h-10 font-bold text-2xl py-1 rounded-sm hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>

            <div>
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <div key={property.id} className='bg-amber-300 text-xl rounded-2xl mt-2 p-2 flex flex-col'>
                            <h1>Property Name: {property.title || "N/A"}</h1>
                            <h1>Location: {property.location || "N/A"}</h1>
                            <h1>Bedrooms: {property.bedroom || "N/A"}</h1>
                            <h1>Bathrooms: {property.bathroom || "N/A"}</h1>
                            <h1>Amenities: {property.amenities || "N/A"}</h1>
                            <h1>Agent Name: {property.agent?.name || "N/A"}</h1>

                            <button
                                className={`rounded-2xl px-2 py-1 justify-center flex items-center m-5 ml-24 mr-24 text-2xl font-semibold ${
                                    disabledButtons[property.id]
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-500 hover:outline-1"
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
