import { useState } from "react";
import ChatSidebar from "./Components/ChatSidebar";
import ChatArea from "./Components/ChatArea";
import "./App.css";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./router/Index";
import {ToastContainer} from 'react-toastify'





function App() {
  return (
    <>
    
        <BrowserRouter>
      <MainRouter />
      <ToastContainer/>
    </BrowserRouter>

    </>
  );
}

export default App;
