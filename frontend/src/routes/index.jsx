
import { createBrowserRouter, Navigate } from 'react-router'
import App from '../App.jsx'
import ProtectedRoute from './ProtectedRoutes.jsx'
import Layout from '../components/layout/Layout.jsx'

import Login from '../components/Auth/Login.jsx'

// // Auth pages
// import Login from '../pages/auth/Login.jsx'
// import Signup from '../pages/auth/Signup.jsx'
import Dashboard from '../components/Dashborad.jsx'
import VendorRatesForm from '../components/Forms/VendorRate.jsx'
import CustomerOnboarding from '../components/Forms/CustomerOnborading.jsx'
import ProductAssignmentForm from '../components/Forms/ProductAssign.jsx'
import FileUploadForm from '../components/Forms/FileUpload.jsx'
import ChargeCalculationForm from '../components/Forms/ChargeCalculation.jsx'
import VendorListPage from '../components/Tables/VendorTable.jsx'
import VendorMasterForm from '../components/Forms/Vendor.jsx'
import ProductMasterForm from '../components/Forms/Product.jsx'
import Inward from '../components/Forms/Inward.jsx'
import Outward from '../components/Forms/Outward.jsx'
import Returns from '../components/Forms/Return.jsx'
import ProductList from '../components/Tables/ProductList.jsx'
import VendorRatesManagement from '../components/Tables/VendorRatesTable.jsx'
import ProductPricingPage from '../components/Tables/ProductPricing.jsx'
import CustomerRatesManagement from '../components/Tables/PricingTable.jsx'
import CustomerDashboard from '../components/Dashborad.jsx'
import CustomerListComponent from '../components/Tables/CustomerList.jsx'
import PricingSchemeForm from '../components/Forms/PricingForm.jsx'
import SchemeList from '../components/Tables/SchemeList.jsx'
import ProductAssignment from '../components/Tables/ProductAssign_Scheme.jsx'
import ProductDistribution from '../components/Forms/ProductAssign.jsx'
import MerchantListComponent from '../components/Tables/MerchantList.jsx'
import ErrorPage from '../components/ErrorPage.jsx'
import VendorProductUploadForm from '../components/Forms/FileUpload.jsx'



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
            element: <CustomerDashboard />
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
                path: "add",
                element: <VendorMasterForm />
              },
              {
                path: "rates",
                element: <VendorRatesManagement />
              }
              // {
              //   path: ":id",
              //   element: <VendorDetails />
              // }
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
                path: "add",
                element: <ProductMasterForm />
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
                path: "inward",
                element: <Inward />
              },
              {
                path: "outward",
                element: <Outward />
              },
              {
                path: "returns",
                element: <Returns />
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