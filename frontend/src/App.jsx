import React from 'react'
import Login from './components/login'
import ClientSignup from './components/ClientSignup'
import { Routes,Route } from 'react-router-dom'
import AgentSignup from './components/AgentSignup'
import AgentLogin from './components/AgentLogin'
import Agent from './dashboards/Agent'
import CLient from './dashboards/CLient'
import Properties from './components/Properties';
import UserContext from './components/UserContext'


const App = () => {
  return (
  <UserContext>
     <Routes>
  <Route path='/' element={<ClientSignup></ClientSignup>}/>
      <Route path='/client/signup' element={<Login></Login>}/>
      <Route path='/agent/login' element={<AgentSignup></AgentSignup>}/>
      <Route path='/agent/signup' element={<AgentLogin></AgentLogin>}/>
      <Route path='/agent/dashboard' element={<Agent></Agent>}/>
      <Route path='/client/dashboard' element={<CLient></CLient>}/>
     </Routes>
  </UserContext>
    
      
  
  
  )
}

export default App