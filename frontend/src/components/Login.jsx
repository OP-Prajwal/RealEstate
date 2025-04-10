import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
const Login = () => {
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [phno, setphno] = useState("")
  const [password, setpassword] = useState("")
const Navigate=useNavigate()
  const submitHandler = async(e) => {
    e.preventDefault()
    const user = {
      name: name,
      email: email,
      phone: phno,
      password: password,
    }
    const response = await axios.post('http://localhost:3000/api/auth/client/register', user);
    localStorage.setItem(response.data.token,'clientToken')
    if(response){
      Navigate('/client/dashboard')
    }
    console.log(user)

    setname("")
    setemail("")
    setphno("")
    setpassword("")
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <form
        onSubmit={submitHandler}
        className="bg-black/25 w-full max-w-md m-4 border-2 border-white shadow-md rounded-lg px-8 pt-6 pb-8"
      >
        <h1 className="text-4xl font-mono mb-6 text-center text-white">Signup</h1>
        <div>
          <label className="block text-white text-xl mb-2" htmlFor="name">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Enter your name"
            className="border p-2 mb-4 w-full rounded-md text-black text-lg bg-gray-50"
            type="text"
            id="name"
            autoComplete="name"
          />
        </div>
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
          <label className="block text-white text-xl mb-2" htmlFor="phno">
            Phone Number
          </label>
          <input
            value={phno}
            onChange={(e) => setphno(e.target.value)}
            placeholder="Enter your phone number"
            className="border p-2 mb-4 w-full rounded-md text-black text-lg bg-gray-50"
            type="tel"
            id="phno"
            autoComplete="tel"
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
          Login
        </button>
        <div className="mt-4 text-center text-white">
  <div className="mb-2">
    <Link to="/" className="hover:underline hover:text-blue-500">
      <span>already have an account?</span>
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

export default Login