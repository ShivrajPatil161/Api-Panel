// import { BrowserRouter, Routes, Route } from 'react-router';
// import SidebarLayout from './components/SideBarLayout';
// import VendorMasterForm from './components/Forms/Vendor';
// import Dashboard from './components/Dashborad';
// import VendorRateForm from './components/Forms/VendorRate';
// import InwardForm from './components/Forms/Inward';
// import OutwardForm from './components/Forms/Outward';
// import ReturnForm from './components/Forms/Return';
// import CustomerOnborading from "./components/Forms/CustomerOnborading"
// import ProductAssignmentForm from './components/Forms/ProductAssign';
// import ProductPricingForm from './components/Forms/ProductPricing';
// import FileUploadForm from './components/Forms/FileUpload';
// import ChargeCalculationForm from './components/Forms/ChargeCalculation';
// import ProductMasterForm from './components/Forms/Product';
// import VendorRatesForm from './components/Forms/VendorRate';
// import Login from './components/Auth/Login';

// const App =() => {
//   return (
//     <BrowserRouter>
//       <Routes>
//          <Route path="/login" element={<Login />} />
//       </Routes>
//       <SidebarLayout>
//         <Routes>
         
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/vendor-master" element={<VendorMasterForm />} />
//           <Route path="/vendor-rates" element={<VendorRatesForm />} />
//           <Route path="/product" element={<ProductMasterForm />} />
//           <Route path="/inward" element={<InwardForm />} />
//           <Route path="/outward" element={<OutwardForm />} />
//           <Route path="/return" element={<ReturnForm />} />
//           <Route path="/customer-onboarding" element={<CustomerOnborading />} />
//           <Route path="/product-assign" element={<ProductAssignmentForm />} />
//           <Route path="/product-pricing" element={<ProductPricingForm />} />
//           <Route path="/file-upload" element={<FileUploadForm />} />
//           <Route path="/charge-calculation" element={<ChargeCalculationForm />} />

//           {/* <Route path="/product-master" element={<ProductMasterForm />} /> */}
//           {/* Add other routes */}
//         </Routes>
//       </SidebarLayout>
//     </BrowserRouter>
//   );
// }

// export default App;
import { Outlet } from 'react-router'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  )
}

export default App