import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ClientSignup = () => {
 const usenavigate=useNavigate()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const submitHandler = async(e) => {
    e.preventDefault()
    const user = {
      email: email,
      password: password,
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/client/login', 
        user, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      const token = response.data.token;
      localStorage.setItem('clientToken', token);
      usenavigate('/client/dashboard');
    } catch (error) {
      if (error.response) {
        console.error("Login error:", error.response.data); // This shows the backend's response
        alert(`Login failed: ${error.response.data.message}`); // Show user-friendly message
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Login failed: No response from server");
      } else {
        console.error("Unexpected error:", error.message);
        alert(`Login failed: ${error.message}`);
      }
    }
    
    setemail("");
    setpassword("");
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <form
        onSubmit={(e)=>submitHandler(e)}
        className="bg-black/25 w-full max-w-md m-4 border-2 border-white shadow-md rounded-lg px-8 pt-6 pb-8"
      >
        <h1 className="text-4xl font-mono mb-6 text-center text-white">client Login</h1>
        
        <div>
          <label className="block text-white text-xl mb-2" htmlFor="email">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Enter your email"
            className="border p-2 mb-4 w-full rounded-md text-black text-lg bg-gray-50"
            type="email"
            id="email"
            autoComplete="email"
          />
        </div>
        
        <div>
          <label className="block text-white text-xl mb-2" htmlFor="password">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Enter your password"
            className="border p-2 mb-4 w-full rounded-md text-black text-lg bg-gray-50"
            type="password"
            id="password"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-8 rounded-md text-lg w-full"
        >
          SignIn
        </button>
        <div className="mt-4 text-center text-white">
  <div className="mb-2">
    <Link to="/client/signup" className="hover:underline hover:text-blue-500">
      <span>Don't have an account?</span>
    </Link>
  </div>
  <div>
    <Link to="/agent/signup" className="hover:underline hover:text-blue-500">
      <span>Want to become an agent?</span>
    </Link>
  </div>
</div>
      </form>
    </div>
  )
}

export default ClientSignup