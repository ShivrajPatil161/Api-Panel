import { createBrowserRouter } from "react-router"
import App from "../App"
import Dashboard from "../components/Dashborad"
import Vendor from "../components/Forms/Vendor"
import Product from "../components/Forms/Product"
import Inward from "../components/Forms/Inward"
import Outward from "../components/Forms/Outward"
import Return from "../components/Forms/Return"
import CustomerOnborading from "../components/Forms/CustomerOnborading"
import ProductAssign from "../components/Forms/ProductAssign"
import ProductPricing from "../components/Forms/ProductPricing"
import FileUpload from "../components/Forms/FileUpload"
import ChargeCalculation from "../components/Forms/ChargeCalculation"


export  const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    { index: true, element: <Dashboard /> }, // ✅ index route for "/"
      { path: "vendor", element: <Vendor /> },
      //{ path: "vendor-rates", element: <VendorRatesForm /> },
      { path: "product", element: <Product /> },
      { path: "inward", element: <Inward /> },
      { path: "outward", element: <Outward /> },
      { path: "return", element: <Return /> },
      { path: "customer", element: <CustomerOnborading /> },
      { path: "assignment", element: <ProductAssign /> },
      { path: "pricing", element: <ProductPricing /> },
      { path: "upload", element: <FileUpload /> },
      { path: "charges", element: <ChargeCalculation /> }
    ]
  }
])
