import React, { useState } from 'react';
import Properties from '../components/Properties';
import Contracts from '../components/Contracts';
import ErrorBoundary from '../components/ErrorBoundary';
import Profile from '../components/Profile';
import axios from 'axios';

const Agent = () => {
  const [activeSection, setActiveSection] = useState("properties");
  const [profile, setprofile] = useState(false);
   const [profileDetails, setprofileDetails] = useState([])
    const getProfile=async()=>{
          const token=localStorage.getItem('agentToken')
          const response=await axios.get('http://localhost:3000/api/auth/agent/profile', {
              headers:{
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              }
              
          })
          setprofileDetails(response.data.profile)
  console.log(response.data)
      }
      
  return (
    <div>
      <div className=''>
        <div className='text-2xl font-mono text-center bg-orange-400 p-2 flex flex-row items-center'>
          <h1 className='flex-grow'>Agent Dashboard</h1>
          <div 
            onClick={() => {setprofile(true);getProfile()}}  
            className='bg-white rounded-full w-10 h-10 flex justify-center items-center ml-auto cursor-pointer hover:scale-105 transition'
          >
            <span className="text-black font-bold">P</span>
          </div>
        </div>
      </div>

      <div className='flex flex-row justify-evenly text-center text-2xl m-2 bg-amber-200 mt-2 border-2'>
        <div
          className={`text-center p-2 border-r-2 border-r-black w-1/2 ${activeSection === "properties" ? 'bg-amber-400' : ""}`}
          onClick={() => setActiveSection("properties")}
        >
          Properties
        </div>
        <div
          className={`text-center p-2 w-1/2 ${activeSection === "contracts" ? 'bg-amber-400' : ""}`}
          onClick={() => setActiveSection("contracts")}
        >
          Contracts
        </div>
      </div>

      {activeSection === "properties" && <Properties />}
      {activeSection === "contracts" && (
        <ErrorBoundary>
          <Contracts />
        </ErrorBoundary>
      )}

      {profile && <ErrorBoundary><Profile profileDetails={profileDetails} onClose={() => setprofile(false)} /></ErrorBoundary> }
    </div>
  );
};

export default Agent;
