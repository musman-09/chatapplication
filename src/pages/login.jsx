import React, { useState } from "react";
import wbg from "../assets/images/whatsapp background.jpg";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firbase/firebaseconfig";
import { set } from "firebase/database";
import LoadingIcons from 'react-loading-icons'
import { login, logout } from "../Redux/features/AuthRouteSlice";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setemail] = useState(null);
  const [password, setpassword] = useState(null);
  const [loading, setloading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true)
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(login(email))
      navigate("/chatSideBar");
      toast.success("user logged in");
    } catch (error) {
      toast.success(error.message);
      setloading(false)
     
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-blue-100"
      style={{ backgroundImage: `url(${wbg})` }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">
          Welcome to GupShup
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Log in to continue to GupShup
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setemail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setpassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
           {loading ? <LoadingIcons.Bars className="w-6 h-6" /> : "Log In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
