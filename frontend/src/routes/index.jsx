import { createBrowserRouter, Navigate } from 'react-router'
import { Suspense, lazy } from 'react'
const App = lazy(() => import('../App.jsx'));
const ProtectedRoute = lazy(() => import('./ProtectedRoutes.jsx'));
const Layout = lazy(() => import('../components/layout/Layout.jsx'));
const Login = lazy(() => import('../components/Auth/Login.jsx'));
const ForgotPassword = lazy(() => import('../components/Auth/ForgotPass.jsx'));
const ResetPassword = lazy(() => import('../components/Auth/ResetPassword.jsx'));
const ResetPasswordExpired = lazy(() => import('../components/Auth/ResetPasswordExpired.jsx'));
const ErrorPage = lazy(() => import('./roleRoutes/ErrorPage.jsx'));
const TableShimmer = lazy(() => import('../components/Shimmer/TableShimmer.jsx'));

import { adminRoutes } from './roleRoutes/adminRoutes.jsx'
import { merchantRoutes } from './roleRoutes/merchantRoutes.jsx'




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
            <Suspense fallback={<TableShimmer />}>
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