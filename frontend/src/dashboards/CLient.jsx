import React, { useState } from 'react';
import ClientProperties from '../components/ClientProperties';
import ClientRegisterations from '../components/ClientRegisterations';
const CLient = () => {
  const [activeSection, setActiveSection] = useState("properties");

  return (
    <div>
      <div className=''>
        <div 
          className='text-2xl font-mono text-center bg-blue-400 p-2 flex flex-row items-center'
        >
          <h1 className='flex-grow'>Client Dashboard</h1>
          <div className='bg-white rounded-full w-10 h-10 flex justify-end items-end ml-auto'>
            C
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
    </div>
  );
};

export default CLient;