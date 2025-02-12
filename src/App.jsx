import { useState } from "react";
import "./App.css";
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
