import React from 'react';

const ClientProfile = ({ onClose, profileDetails }) => {
  let a= profileDetails.name?.charAt(0)
  console.log(a)
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
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Client Profile</h2>
          
          <div className="w-24 h-24 rounded-full bg-blue-200 text-blue-800 font-bold text-3xl flex items-center justify-center mb-6 shadow-inner">
            {a || "C"}
          </div>

          <div className="space-y-2 text-lg text-gray-700 w-full text-left">
            <p><span className="font-semibold text-gray-900">Name:</span> {profileDetails?.name || "N/A"}</p>
            <p><span className="font-semibold text-gray-900">Email:</span> {profileDetails?.email || "N/A"}</p>
            <p><span className="font-semibold text-gray-900">Phone:</span> {profileDetails?.phone || "N/A"}</p>
            <p><span className="font-semibold text-gray-900">Total Registered Properties:</span> {profileDetails?.total_registered || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
