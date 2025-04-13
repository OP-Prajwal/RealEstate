import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import Cookies from 'js-cookie'; // Correct library for client-side cookie management

const Properties = () => {
 
  const [showUploadModal, setShowUploadModal] = useState(false); // State to toggle modal visibility
  const [formData, setFormData] = useState({
    title: '', 
    location: '',
    price: '',
    type: '',
    bedroom: '',
    bathroom: '',
    amenities: '',
  }); 
  const [properties, setProperties] = useState([]); 


  const allproperties = async () => { 
    const token = localStorage.getItem('agentToken');
    try {
      const response = await axios.get('http://localhost:3000/api/auth/agent/property', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log("Properties fetched:", response.data.properties);
      setProperties(response.data.properties); // Set the fetched properties to state
    } catch (error) {
      console.error("Error fetching properties:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Unauthorized: Please log in again.");
      }
    }
  };

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;


    const numericFields = ["price", "bedroom", "bathroom"];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('agentToken');
    try {
      const formattedData = {
        title: formData.title,
        location: formData.location,
        price: parseFloat(formData.price), 
        type: formData.type,
        bedroom: parseInt(formData.bedroom, 10), 
        bathroom: parseInt(formData.bathroom, 10), 
        amenities: formData.amenities,
      };

      const response = await axios.post(
        'http://localhost:3000/api/auth/agent/property',
        formattedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('Property added:', response.data.property);
      setShowUploadModal(false); 
      allproperties();
    } catch (error) {
      console.error('Error adding property:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Unauthorized: Please log in again.");
      }
    }
  };

  
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
                name="title" 
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

<div className="relative flex flex-col items-center justify-center py-8">
  <h1 className="text-4xl font-semibold text-gray-800 text-center mb-6">
    All Properties
  </h1>

  <button
    className="absolute right-4 top-1/2 mr-3 transform -translate-y-1/2 bg-green-500 text-white px-8 py-4 text-lg rounded-xl shadow-md hover:bg-green-600 transition duration-300 hover:scale-105"
    onClick={() => setShowUploadModal(true)}
  >
    + Upload Property
  </button>
</div>



     

     
      <div className="mt-3  text-xl m-2 p-2 rounded-2xl flex items-center flex-col">
        {properties.length > 0 ? (
          properties.map((property, index) => (
            <div
            key={index}
            className="relative text-2xl bg-gradient-to-br w-[80%] from-white via-yellow-50 to-yellow-100 border border-yellow-200 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 p-6  mx-auto my-6"
          >
          
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium text-white shadow-md ${
              property.status === 'accepted'
                ? 'bg-green-500'
                : property.status === 'rejected'
                ? 'bg-red-500'
                : 'bg-yellow-500'
            }`}>
              {property.status}
            </div>
          
            
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{property.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{property.location}</p>
          
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-base">
              <p><span className="font-semibold">Price:</span> ${property.price}</p>
              <p><span className="font-semibold">Type:</span> {property.type}</p>
              <p><span className="font-semibold">Bedrooms:</span> {property.bedroom}</p>
              <p><span className="font-semibold">Bathrooms:</span> {property.bathroom}</p>
              <p className="col-span-2"><span className="font-semibold">Amenities:</span> {property.amenities}</p>
            </div>
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