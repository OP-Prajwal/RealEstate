import React from 'react'
import { useState } from 'react'
import Properties from '../components/Properties'
import Contracts from '../components/Contracts'
const Agent = () => {
    const [activeSection, setActiveSection] = useState("properties")
   
  return (
    <div>
       <div className=''>
       <div 
        className='text-2xl font-mono text-center bg-orange-400 p-2 flex flex-row items-center'
        ><h1 className='flex-grow'>Agent Dashboard</h1> 
        <div className='bg-white rounded-full w-10 h-10 flex justify-end items-end ml-auto'>
           p
        </div>
        </div>
       
       </div>
        <div className='flex flex-row justify-evenly text-center text-2xl m-2 bg-amber-200 mt-2 border-2'>
         
        
         <div 
         className={`text-center  p-2 border-r-2 border-r-black w-1/2 ${activeSection==="properties"?'bg-amber-400':""} `}
         onClick={()=>setActiveSection("properties")}
         
         >Properties</div>
         <div 
        className={`text-center  p-2  w-1/2 ${activeSection==="contracts"?'bg-amber-400':""} `}
          onClick={()=>setActiveSection("contracts")}
>            contracts</div>
        </div>

   {activeSection === "properties" && <Properties />}
   {activeSection === "contracts" && <Contracts />}

        <div >
       {

       }
        </div>
    </div>
  )
}

export default Agent