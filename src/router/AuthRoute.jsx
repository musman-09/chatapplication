import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Signup from "../pages/Signup";


const AuthRoute = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
    </Routes>

  );
};
export default AuthRoute;
