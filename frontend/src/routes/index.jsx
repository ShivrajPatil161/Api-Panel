import { createBrowserRouter, Navigate } from 'react-router'
import { Suspense } from 'react'
import App from '../App.jsx'
import ProtectedRoute from './ProtectedRoutes.jsx'
import Layout from '../components/layout/Layout.jsx'
import Login from '../components/Auth/Login.jsx'
import ForgotPassword from '../components/Auth/ForgotPass.jsx'
import ResetPassword from '../components/Auth/ResetPassword.jsx'
import ErrorPage from './roleRoutes/ErrorPage.jsx'

import { adminRoutes } from './roleRoutes/adminRoutes.jsx'
import { merchantRoutes } from './roleRoutes/merchantRoutes.jsx'
import ResetPasswordExpired from '../components/Auth/ResetPasswordExpired.jsx'

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
)

const RootRedirect = () => {
  const isAuthenticated = localStorage.getItem('authToken')
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

// 🧠 Function that selects routes dynamically at runtime
const getRoutesForUser = () => {
  const userType = localStorage.getItem("userType")?.toLowerCase()
console.log(userType)
  if (userType === 'admin' || userType === 'super_admin') {
    console.log('adminRoutes', adminRoutes)
    return adminRoutes
  }

  if (userType === 'merchant') {
    console.log('merchantRoutes', merchantRoutes)
    return merchantRoutes
  }

  // If no valid userType, return empty array (will redirect via ProtectedRoute)
  return []
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <RootRedirect />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "forgot-pass",
        element: <ForgotPassword />
      },
      {
        path: "reset-password",
        element: <ResetPassword />
      },
      {
        path: "reset-password-expired",
        element: <ResetPasswordExpired />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Layout />
            </Suspense>
          </ProtectedRoute>
        ),
        // 👇 Dynamically inject only current user's routes
        children: getRoutesForUser()
      }
    ]
  },
  {
    path: '*',
    element: <ErrorPage />
  }
])