import React, { useState } from 'react';
import axios from 'axios';
import ClientProperties from '../components/ClientProperties';
import ClientRegisterations from '../components/ClientRegisterations';
import ClientProfile from '../components/ClientProfile';
import ErrorBoundary from '../components/ErrorBoundary';

const Client = () => {
  const [activeSection, setActiveSection] = useState("properties");
  const [profile, setProfile] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('clientToken');
      const response = await axios.get('http://localhost:3000/api/auth/client/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setProfileDetails(response.data.profile);
    } catch (error) {
      console.error("Error fetching client profile:", error);
    }
  };

  return (
    <div>
      <div className=''>
        <div className='text-2xl font-mono text-center bg-blue-400 p-2 flex flex-row items-center'>
          <h1 className='flex-grow'>Client Dashboard</h1>
          <div
            onClick={() => {
              setProfile(true);
              getProfile();
            }}
            className='bg-white rounded-full w-10 h-10 flex justify-center items-center ml-auto cursor-pointer hover:scale-105 transition'
          >
            <span className="text-black font-bold">C</span>
          </div>
        </div>
      </div>

      <div className='flex flex-row justify-evenly text-center text-2xl m-2 bg-blue-200 mt-2 border-2'>
        <div
          className={`text-center p-2 border-r-2 border-r-black w-1/2 ${activeSection === "properties" ? 'bg-blue-400' : ""}`}
          onClick={() => setActiveSection("properties")}
        >
          Properties
        </div>
        <div
          className={`text-center p-2 w-1/2 ${activeSection === "registered" ? 'bg-blue-400' : ""}`}
          onClick={() => setActiveSection("registered")}
        >
          Registered
        </div>
      </div>

      {activeSection === "properties" && <ClientProperties />}
      {activeSection === "registered" && <ClientRegisterations />}

      {profile && (
        <ErrorBoundary>
          <ClientProfile profileDetails={profileDetails} onClose={() => setProfile(false)} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Client;
