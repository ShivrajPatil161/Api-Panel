import { createBrowserRouter, Navigate } from 'react-router'
import App from '../App.jsx'
import ProtectedRoute from './ProtectedRoutes.jsx'
import Layout from '../components/layout/Layout.jsx'
//Auth pages
import Login from '../components/Auth/Login.jsx'



import Dashboard from '../components/Dashborad.jsx'
import CustomerOnboarding from '../components/Forms/CustomerOnborading.jsx'
import VendorListPage from '../components/Tables/VendorTable.jsx'

import Returns from '../components/Forms/Return.jsx'
import ProductList from '../components/Tables/ProductList.jsx'
import VendorRatesManagement from '../components/Tables/VendorRatesTable.jsx'
import CustomerListComponent from '../components/Tables/CustomerList.jsx'
import SchemeList from '../components/Tables/SchemeList.jsx'
import ProductAssignment from '../components/Tables/ProductAssign_Scheme.jsx'
import ProductDistribution from '../components/Forms/ProductDistribution.jsx'
import MerchantListComponent from '../components/Tables/MerchantList.jsx'
import ErrorPage from '../components/ErrorPage.jsx'
import VendorProductUploadForm from '../components/Forms/FileUpload.jsx'
import AdminApproval from '../components/Admin/AdminApproval.jsx'
import ForgotPassword from '../components/Auth/ForgotPass.jsx'
import InventoryManagement from '../components/Inventory/Inventory.jsx'
import ResetPassword from '../components/Auth/ResetPassword.jsx'
import CustomerProductsList from '../components/Tables/CustomerProducts/CustomerProductsList.jsx'



// Root component to handle authentication redirect
const RootRedirect = () => {
  // Check if user is authenticated (you'll implement this logic)
  const isAuthenticated = localStorage.getItem('authToken') // or your auth logic

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return <Navigate to="/login" replace />
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
      // {
      //   path: "signup",
      //   element: <Signup />
      // },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          // Vendors routes
          {
            path: "vendors",
            children: [
              {
                index: true,
                element: <VendorListPage />
              },

              {
                path: "rates",
                element: <VendorRatesManagement />
              }

            ]
          },
          // Inventory routes
          {
            path: "inventory",
            children: [
              {
                index: true,
                element: <ProductList />
              },
              {
                path: "pricing",
                // element: <PricingSchemeForm />
                element: <SchemeList />
              },
              {
                path: "products-assign",
                element: <ProductAssignment />
              },
              {
                path: "inventory",
                element: <InventoryManagement />
              },
              {
                path: "returns",
                element: <Returns />
              },
              {
                path: "customer-products",
                element: <CustomerProductsList />
              }
            ]
          },
          // Customer routes
          {
            path: "customers",
            children: [
              {
                index: true,
                element: <CustomerListComponent />
              },
              {
                path: "onboard",
                element: <CustomerOnboarding />
              },
              {
                path: "admin-approval",
                element: <AdminApproval />
              },
              {
                path: "products-distribution",
                element: <ProductDistribution />
              },

            ]
          },
          // Transaction routes
          {
            path: "others",
            children: [
              {
                path: "upload",
                element: <VendorProductUploadForm />
              },
              // {
              //   path: "charges",
              //   element: <ChargeCalculationForm />
              // }
            ]
          }, {
            path: 'merchants',
            element: <MerchantListComponent />
          }
          // Reports
          // {
          //   path: "reports",
          //   element: <Reports />
          // }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <ErrorPage />
  }

])