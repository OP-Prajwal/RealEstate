import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import Cookies from 'js-cookie'; // Correct library for client-side cookie management

const Properties = () => {
 
  const [showUploadModal, setShowUploadModal] = useState(false); // State to toggle modal visibility
  const [formData, setFormData] = useState({
    title: '', // Changed from propertyName to title to match backend
    location: '',
    price: '',
    type: '',
    bedroom: '',
    bathroom: '',
    amenities: '',
  }); // State to manage form inputs
  const [properties, setProperties] = useState([]); // State to store all properties

  // Fetch all properties
  const allproperties = async () => {
    const token = localStorage.getItem('agentToken');
    try {
      const response = await axios.get('http://localhost:3000/api/agent/property', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log("Properties fetched:", response.data.allProperties);
      setProperties(response.data.allProperties); // Set the fetched properties to state
    } catch (error) {
      console.error("Error fetching properties:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Unauthorized: Please log in again.");
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert specific fields to numbers
    const numericFields = ["price", "bedroom", "bathroom"];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('agentToken');
    try {
      const response = await axios.post('http://localhost:3000/api/agent/property', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
         
        },
        withCredentials: true
      }); // POST request to backend
      console.log('Property added:', response.data);
      setShowUploadModal(false); // Close modal on success
      allproperties(); // Refresh the properties list after adding a new property
    } catch (error) {
      console.error('Error adding property:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Unauthorized: Please log in again.");
      }
      
    }
  };

  // Fetch properties on component mount
  useEffect(() => {
    allproperties();
  }, []);

  return (
    <div className="relative">
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-red-500"
              onClick={() => setShowUploadModal(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Upload Property</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title" // Changed from propertyName to title
                placeholder="Property Name"
                className="border p-2 rounded-md"
                value={formData.title}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="border p-2 rounded-md"
                value={formData.location}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="border p-2 rounded-md"
                value={formData.price}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="type"
                placeholder="Type"
                className="border p-2 rounded-md"
                value={formData.type}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="bedroom"
                placeholder="Bedrooms"
                className="border p-2 rounded-md"
                value={formData.bedroom}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="bathroom"
                placeholder="Bathrooms"
                className="border p-2 rounded-md"
                value={formData.bathroom}
                onChange={handleInputChange}
              />
              <textarea
                name="amenities"
                placeholder="Amenities"
                className="border p-2 rounded-md"
                value={formData.amenities}
                onChange={handleInputChange}
              ></textarea>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-row items-center text-center">
        <h1 className="flex-grow text-center text-xl items-center font-bold">
          All Properties
        </h1>
        <button
          className="ml-auto mr-16 bg-green-400 px-1 py-2 text-xl rounded-2xl font-bold"
          onClick={() => setShowUploadModal(true)} // Open modal
        >
          + Upload Property
        </button>
      </div>

      {/* Properties List */}
      <div className="mt-3  text-xl m-2 p-2 rounded-2xl">
        {properties.length > 0 ? (
          properties.map((property, index) => (
            <div key={index} className="ml-2 mt-2 mb-4 bg-amber-300 rounded-2xl p-2 pb-2">
              <h1>Property Name: {property.title}</h1>
              <h1>Location: {property.location}</h1>
              <h1>Price: ${property.price}</h1>
              <h1>Type: {property.type}</h1>
              <h1>Bedrooms: {property.bedroom}</h1>
              <h1>Bathrooms: {property.bathroom}</h1>
              <h1>Amenities: {property.amenities}</h1>
            </div>
          ))
        ) : (
          <h1>No properties found</h1>
        )}
      </div>
    </div>
  );
};

export default Properties;