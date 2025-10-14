// import { createBrowserRouter, Navigate } from 'react-router'
// import App from '../App.jsx'
// import ProtectedRoute from './ProtectedRoutes.jsx'
// import Layout from '../components/layout/Layout.jsx'
// //Auth pages
// import Login from '../components/Auth/Login.jsx'



// import Dashboard from '../components/DashBoards/Dashborad.jsx'
// import CustomerOnboarding from '../components/Forms/CustomerOnboarding/CustomerOnborading.jsx'
// import VendorListPage from '../components/Tables/VendorTable.jsx'

// import Returns from '../components/Forms/Return.jsx'
// import ProductList from '../components/Tables/ProductList.jsx'
// import VendorRatesManagement from '../components/Tables/VendorRatesTable.jsx'
// import CustomerListComponent from '../components/Tables/CustomerList.jsx'
// import SchemeList from '../components/Tables/SchemeList.jsx'
// import ProductAssignment from '../components/Tables/ProductAssign_Scheme.jsx'
// import ProductDistribution from '../components/Forms/ProductDistribution.jsx'
// import MerchantListComponent from '../components/Tables/MerchantList.jsx'
// import ErrorPage from '../components/ErrorPage.jsx'
// import VendorProductUploadForm from '../components/Forms/FileUpload.jsx'
// import AdminApproval from '../components/Admin/AdminApproval.jsx'
// import ForgotPassword from '../components/Auth/ForgotPass.jsx'
// import InventoryManagement from '../components/Inventory/Inventory.jsx'
// import ResetPassword from '../components/Auth/ResetPassword.jsx'
// import CustomerProductsList from '../components/Tables/CustomerProducts/CustomerProductsList.jsx'
// import TransactionUpload from '../components/Forms/FileUpload.jsx'
// import TransactionSelectionForm from '../components/Forms/ChargeCalculation.jsx'
// import SettlementBatchStatusMonitor from '../components/Tables/SettlementBatchStatusMonitor.jsx'
// import DirectSettlementPage from '../components/Charge Settlement/DirectSettlementPage.jsx'
// import FranchiseSettlementPage from '../components/Charge Settlement/FranchiseSettlementPage.jsx'
// import InwardForCustomer from '../components/Tables/InwardForCustomer.jsx'
// import ProductOutward from '../components/Tables/ProductOutward.jsx'
// import MainReportsPageForNow from '../components/Reports/MainReportsPageForNow.jsx'
// import Payout from '../components/Payout/Payout.jsx'
// import CreditCardBillPayment from '../components/Payout/CreditCardBillPayment.jsx'
// import AdminRolesDashboard from '../components/Admin/AdminRolesDashboard.jsx'
// import BusinessLogs from '../components/Admin/BusinessLogs.jsx'
// import WalletAdjustment from '../components/Admin/WalletAdjustment.jsx'
// import ProductDistributionList from '../components/Tables/ProductDistributionList.jsx'



// // Root component to handle authentication redirect
// const RootRedirect = () => {
//   // Check if user is authenticated (you'll implement this logic)
//   const isAuthenticated = localStorage.getItem('authToken') // or your auth logic

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />
//   }
//   return <Navigate to="/login" replace />
// }

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <RootRedirect />
//       },
//       {
//         path: "login",
//         element: <Login />
//       },
//       {
//         path: "forgot-pass",
//         element: <ForgotPassword />
//       },
//       {
//         path: "reset-password",
//         element: <ResetPassword />
//       },
//       // {
//       //   path: "signup",
//       //   element: <Signup />
//       // },
//       {
//         path: "dashboard",
//         element: (
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         ),
//         children: [
//           {
//             index: true,
//             element: <Dashboard />
//           },
//           {
//             path: "role-management",
//             element:<AdminRolesDashboard />
//           },
//           {
//             path: "wallet-adjustment",
//             element: <WalletAdjustment />
//           },
//           {
//             path: "logs",
//             element: <BusinessLogs />
//           },
//           // Vendors routes
//           {
//             path: "vendors",
//             children: [
//               {
//                 index: true,
//                 element: <VendorListPage />
//               },

//               {
//                 path: "rates",
//                 element: <VendorRatesManagement />
//               }

//             ]
//           },
//           // Inventory routes
//           {
//             path: "inventory",
//             children: [
//               {
//                 index: true,
//                 element: <ProductList />
//               },
//               {
//                 path: "pricing",
//                 // element: <PricingSchemeForm />
//                 element: <SchemeList />
//               },
//               {
//                 path: "products-assign",
//                 element: <ProductAssignment />
//               },
//               {
//                 path: "inventory",
//                 element: <InventoryManagement />
//               },
//               {
//                 path: "returns",
//                 element: <Returns />
//               },
//               {
//                 path: "customer-products",
//                 element: <CustomerProductsList />
//               }
//             ]
//           },
//           // Customer routes
//           {
//             path: "customers",
//             children: [
//               {
//                 index: true,
//                 element: <CustomerListComponent />
//               },
//               {
//                 path: "onboard",
//                 element: <CustomerOnboarding />
//               },
//               {
//                 path: "admin-approval",
//                 element: <AdminApproval />
//               },
//               {
//                 path: "products-distribution",
//                 element: <ProductDistributionList />
//               },
//               {
//                 path: "inward-products",
//                 element: <ProductOutward />
//               },

//             ]
//           },
//           // Transaction routes
//           {
//             path: "others",
//             children: [
//               {
//                 path: "upload",
//                 element: <TransactionUpload />
//               },
//               {
//                 path: "charges",
//                 element: <TransactionSelectionForm />
//               },
//               {
//                 path: "batch-status",
//                 element: <SettlementBatchStatusMonitor />
//               }
//             ]
//           }, {
//             path: 'merchants',
//             element: <MerchantListComponent />
//           },
//           , {
//             path: 'payout',
//             element: <Payout />
//           },
//           {
//             path: 'credit-card-bill-payment',
//             element: <CreditCardBillPayment />
//           },
//           // Reports
//           {
//             path: "reports",
//             element: <MainReportsPageForNow />
//           }
//         ]
//       }
//     ]
//   },
//   {
//     path: '*',
//     element: <ErrorPage />
//   }

// ])





// import { createBrowserRouter, Navigate } from 'react-router'
// import { Suspense } from 'react'
// import App from '../App.jsx'
// import ProtectedRoute from './ProtectedRoutes.jsx'
// import Layout from '../components/layout/Layout.jsx'
// import Login from '../components/Auth/Login.jsx'
// import ForgotPassword from '../components/Auth/ForgotPass.jsx'
// import ResetPassword from '../components/Auth/ResetPassword.jsx'
// import ErrorPage from './roleRoutes/ErrorPage.jsx'

// import { adminRoutes } from './roleRoutes/adminRoutes.jsx'
// import { franchiseRoutes } from './roleRoutes/franchiseRoutes.jsx'
// import { merchantRoutes } from './roleRoutes/merchantRoutes.jsx'

// const LoadingFallback = () => (
//   <div className="flex items-center justify-center h-screen">
//     <div className="text-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//       <p className="mt-4 text-gray-600">Loading...</p>
//     </div>
//   </div>
// )

// const RootRedirect = () => {
//   const isAuthenticated = localStorage.getItem('authToken')
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
// }

// // Route guard that checks at render time
// const RoleBasedRoute = ({ element, allowedRoles }) => {
//   const userType = localStorage.getItem('userType')?.toLowerCase()
// console.log(userType, allowedRoles)
//   if (!userType) {
//     return <Navigate to="/login" replace />
//   }

//   if (!allowedRoles.includes(userType)) {
//     return <Navigate to="/dashboard" replace />
//   }

//   return element
// }

// // Helper to wrap routes with role checking
// const createRoleRoutes = (routes, allowedRoles) => {
//   return routes.map(route => {
//     if (route.children) {
//       return {
//         ...route,
//         children: createRoleRoutes(route.children, allowedRoles)
//       }
//     }
//     return {
//       ...route,
//       element: <RoleBasedRoute element={route.element} allowedRoles={allowedRoles} />
//     }
//   })
// }

// const userType = localStorage.getItem('userType')?.toLowerCase();
// let allowedRoutes = [];
// if (userType === 'admin' || userType === 'super_admin') {
//   allowedRoutes = createRoleRoutes(adminRoutes, ['admin', 'super_admin']);
// } else if (userType === 'franchise') {
//   allowedRoutes = createRoleRoutes(franchiseRoutes, ['franchise']);
// } else if (userType === 'merchant') {
//   allowedRoutes = createRoleRoutes(merchantRoutes, ['merchant']);
// }


// // Combine all routes with role guards
// const allDashboardRoutes = [
//   ...createRoleRoutes(adminRoutes, ['admin', 'super_admin']),
//   ...createRoleRoutes(franchiseRoutes, ['franchise']),
//   ...createRoleRoutes(merchantRoutes, ['merchant'])
// ]

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <RootRedirect />
//       },
//       {
//         path: "login",
//         element: <Login />
//       },
//       {
//         path: "forgot-pass",
//         element: <ForgotPassword />
//       },
//       {
//         path: "reset-password",
//         element: <ResetPassword />
//       },
//       {
//         path: "dashboard",
//         element: (
//           <ProtectedRoute>
//             <Suspense fallback={<LoadingFallback />}>
//               <Layout />
//             </Suspense>
//           </ProtectedRoute>
//         ),
//         children: allDashboardRoutes
//       }
//     ]
//   },
//   {
//     path: '*',
//     element: <ErrorPage />
//   }
// ])

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
import { franchiseRoutes } from './roleRoutes/franchiseRoutes.jsx'
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
  const userType = localStorage.getItem('userType')?.toLowerCase()
console.log(userType)
  if (userType === 'admin' || userType === 'super_admin') {
    console.log('adminRoutes', adminRoutes)
    return adminRoutes
  }
  if (userType === 'franchise') {
    console.log('franchiseRoutes', franchiseRoutes)
    return franchiseRoutes
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