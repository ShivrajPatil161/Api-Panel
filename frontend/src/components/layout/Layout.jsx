import { Outlet } from 'react-router'

import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

const Layout = () => {

  const userType = localStorage.getItem("userType")
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar userType={userType } />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userType={userType} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout