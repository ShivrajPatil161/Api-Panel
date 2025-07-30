import { createBrowserRouter } from "react-router"
import App from "../App"
import Dashboard from "../components/Dashborad"
import Vendor from "../components/Forms/Vendor"
import CustomerOnboradingForm from "../components/Forms/CustomerOnborading"
import VendorRateForm from "../components/Forms/VendorRate"
import ProductForm from "../components/Forms/Product"
import InwardForm from "../components/Forms/Inward"
import OutwardForm from "../components/Forms/Outward"
import ReturnForm from "../components/Forms/Return"
import ProductAssignmentForm from "../components/Forms/ProductAssign"
import FileUploadForm from "../components/Forms/FileUpload"
import ProductPricingForm from "../components/Forms/ProductPricing"
import ChargeCalculationForm from "../components/Forms/ChargeCalculation"
import Login from "../components/Login"


export  const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    { index: true, element: <Dashboard /> }, // ✅ index route for "/"
      { path: "vendor", element: <Vendor /> },
      { path: "vendor-rates", element: <VendorRateForm /> },
      { path: "product", element: <ProductForm /> },
      { path: "inward", element: <InwardForm /> },
      { path: "outward", element: <OutwardForm /> },
      { path: "return", element: <ReturnForm /> },
      { path: "customer", element: <CustomerOnboradingForm   /> },
      { path: "assignment", element: <ProductAssignmentForm /> },
      { path: "pricing", element: <ProductPricingForm /> },
      { path: "upload", element: <FileUploadForm /> },
      { path: "charges", element: <ChargeCalculationForm /> },
      { path: "login", element: <Login /> }

    ]
  }
])
