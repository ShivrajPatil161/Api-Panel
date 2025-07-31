// import { createBrowserRouter } from "react-router"
// import App from "../App"
// import Dashboard from "../components/Dashborad"
// import Vendor from "../components/Forms/Vendor"
// import Product from "../components/Forms/Product"
// import Inward from "../components/Forms/Inward"
// import Outward from "../components/Forms/Outward"
// import Return from "../components/Forms/Return"
// import CustomerOnborading from "../components/Forms/CustomerOnborading"
// import ProductAssign from "../components/Forms/ProductAssign"
// import ProductPricing from "../components/Forms/ProductPricing"
// import FileUpload from "../components/Forms/FileUpload"
// import ChargeCalculation from "../components/Forms/ChargeCalculation"
// import VendorRateForm from "../components/Forms/VendorRate"
// import ProductForm from "../components/Forms/Product"
// import InwardForm from "../components/Forms/Inward"
// import OutwardForm from "../components/Forms/Outward"
// import ReturnForm from "../components/Forms/Return"
// import ProductAssignmentForm from "../components/Forms/ProductAssign"
// import FileUploadForm from "../components/Forms/FileUpload"
// import ProductPricingForm from "../components/Forms/ProductPricing"
// import ChargeCalculationForm from "../components/Forms/ChargeCalculation"
// import Login from "../components/Auth/Login"


// export  const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//     { index: true, element: <Dashboard /> }, // ✅ index route for "/"
//       { path: "vendor", element: <Vendor /> },
//       { path: "vendor-rates", element: <VendorRateForm /> },
//       { path: "product", element: <ProductForm /> },
//       { path: "inward", element: <InwardForm /> },
//       { path: "outward", element: <OutwardForm /> },
//       { path: "return", element: <ReturnForm /> },
//       { path: "customer", element: <CustomerOnborading /> },
//       { path: "assignment", element: <ProductAssignmentForm /> },
//       { path: "pricing", element: <ProductPricingForm /> },
//       { path: "upload", element: <FileUploadForm /> },
//       { path: "charges", element: <ChargeCalculationForm /> },
//       { path: "login", element: <Login /> }

//     ]
//   }
// ])

import { createBrowserRouter, Navigate } from 'react-router'
import App from '../App.jsx'
import ProtectedRoute from './ProtectedRoutes.jsx'
import Layout from '../components/layout/Layout.jsx'

import Login from '../components/Auth/Login.jsx'

// // Auth pages
// import Login from '../pages/auth/Login.jsx'
// import Signup from '../pages/auth/Signup.jsx'
import Dashboard from '../components/Dashborad.jsx'
import InwardForm from '../components/Forms/Inward.jsx'
import OutwardForm from '../components/Forms/Outward.jsx'
import VendorRatesForm from '../components/Forms/VendorRate.jsx'
import ProductPricingForm from '../components/Forms/ProductPricing.jsx'
import CustomerOnboarding from '../components/Forms/CustomerOnborading.jsx'
import ProductAssignmentForm from '../components/Forms/ProductAssign.jsx'
import FileUploadForm from '../components/Forms/FileUpload.jsx'
import ChargeCalculationForm from '../components/Forms/ChargeCalculation.jsx'
import VendorListPage from '../components/Tables/VendorTable.jsx'
import VendorMasterForm from '../components/Forms/Vendor.jsx'
import ProductMasterForm from '../components/Forms/Product.jsx'
import ReturnForm from '../components/Forms/Return.jsx'
import ProductPricingPage from '../components/Forms/ProductPricing.jsx'

// Dashboard
// import Dashboard from '../pages/Dashboard.jsx'

// // Vendor pages
// import VendorList from '../pages/vendors/VendorList.jsx'
// import VendorAdd from '../pages/vendors/VendorAdd.jsx'
// import VendorRates from '../pages/vendors/VendorRates.jsx'
// import VendorDetails from '../pages/vendors/VendorDetails.jsx'

// // Product pages
// import ProductList from '../pages/products/ProductList.jsx'
// import ProductAdd from '../pages/products/ProductAdd.jsx'
// import ProductPricing from '../pages/products/ProductPricing.jsx'

// // Inventory pages
// import Inward from '../pages/inventory/Inward.jsx'
// import Outward from '../pages/inventory/Outward.jsx'
// import Returns from '../pages/inventory/Returns.jsx'

// // Customer pages
// import CustomerList from '../pages/customers/CustomerList.jsx'
// import CustomerOnboard from '../pages/customers/CustomerOnboard.jsx'
// import ProductAssign from '../pages/customers/ProductAssign.jsx'

// // Transaction pages
// import FileUpload from '../pages/transactions/FileUpload.jsx'
// import ChargeCalculation from '../pages/transactions/ChargeCalculation.jsx'

// // Reports
// import Reports from '../pages/Reports.jsx'

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
                path: "add",
                element: <VendorMasterForm />
              },
              {
                path: "rates",
                element: <VendorRatesForm />
              }
              // {
              //   path: ":id",
              //   element: <VendorDetails />
              // }
            ]
          },
          // Products routes
          {
            path: "inventory",
            children: [
              // {
              //   index: true,
              //   element: <ProductList />
              // },
              {
                path: "add",
                element: <ProductMasterForm />
              },
              {
                path: "pricing",
                element: <ProductPricingPage />
              },
              {
                path: "inward",
                element: <InwardForm />
              },
              {
                path: "outward",
                element: <OutwardForm />
              },
              {
                path: "returns",
                element: <ReturnForm />
              }
            ]
          },
          // Customer routes
          {
            path: "customers",
            children: [
              // {
              //   index: true,
              //   element: <CustomerList />
              // },
              {
                path: "onboard",
                element: <CustomerOnboarding />
              },
              {
                path: "assign-products",
                element: <ProductAssignmentForm />
              }
            ]
          },
          // Transaction routes
          {
            path: "others",
            children: [
              {
                path: "upload",
                element: <FileUploadForm />
              },
              {
                path: "charges",
                element: <ChargeCalculationForm />
              }
            ]
          }
          // Reports
          // {
          //   path: "reports",
          //   element: <Reports />
          // }
        ]
      }
    ]
  }
])