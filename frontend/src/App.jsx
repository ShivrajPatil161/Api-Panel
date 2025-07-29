import React from 'react'
import Sidebar from './components/SideBar/sideBar'
import { Outlet } from 'react-router'

const App = () => {
  return (
     <div className="flex">
          
      <Sidebar />
      <main className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet />
          </main>
          
    </div>
  )
}

export default App