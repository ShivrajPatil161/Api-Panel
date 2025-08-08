import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
       {/* Toast Container */}
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="text-sm"
        bodyClassName="text-sm"
        limit={5}
      />
      <Outlet />
    </div>
  )
}

export default App