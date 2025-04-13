import axios from 'axios';
import React from 'react';
import { useState } from 'react';
const Profile = ({ onClose ,profileDetails}) => {

  console.log(profileDetails)
  
  return (

    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] md:w-[60%] lg:w-[40%] rounded-2xl p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
          title="Close"
        >
          &times;
        </button>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Agent Profile</h2>
          
          <div className="w-24 h-24 rounded-full bg-green-200 text-green-800 font-bold text-3xl flex items-center justify-center mb-6 shadow-inner">
            A
          </div>

          <div className="space-y-2 text-lg text-gray-700 w-full text-left">
            <p><span className="font-semibold text-gray-900">Name:</span> {profileDetails.name}</p>
            <p><span className="font-semibold text-gray-900">Email:</span> {profileDetails.email}</p>
            <p><span className="font-semibold text-gray-900">Phone:</span> {profileDetails.phone}</p>
            <p><span className="font-semibold text-gray-900">Total Sales:</span> {profileDetails.total_sales}</p>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Profile;
