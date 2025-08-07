import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Outlet />
    </div>
  )
}

export default App