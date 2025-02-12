import React from 'react'
import ChatArea from '../Components/ChatArea'
import { Route, Routes } from 'react-router-dom'
import ChatSidebar from '../Components/ChatSideBar'


const AppRoute = () => {
  return (


    <>

      <Routes>
        <Route exact path="/chatSideBar" element={<ChatSidebar />} />
        <Route exact path="/ChatArea" element={<ChatArea />} />
      </Routes>

    </>
  )
}

export default AppRoute