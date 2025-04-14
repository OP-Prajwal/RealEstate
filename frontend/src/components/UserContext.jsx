import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UserContext = ({children}) => {
const navigate=useNavigate()

  const token=localStorage.getItem('agentToken') || localStorage.getItem('clientToken')

  useEffect(()=>{

    if(!token){
    navigate('/')
    }


  },[token])





  return (
    <>{children}</>
  )
}

export default UserContext