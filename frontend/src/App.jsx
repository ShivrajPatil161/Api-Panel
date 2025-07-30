import { BrowserRouter, Routes, Route } from 'react-router';
import SidebarLayout from './components/SideBarLayout';
import VendorMasterForm from './components/Forms/Vendor';
import Dashboard from './components/Dashborad';
import ProductForm from './components/Forms/Product';
import VendorRateForm from './components/Forms/VendorRate';
import InwardForm from './components/Forms/Inward';
import OutwardForm from './components/Forms/Outward';
import ReturnForm from './components/Forms/Return';
import CustomerOnborading from "./components/Forms/CustomerOnborading"
import ProductAssignmentForm from './components/Forms/ProductAssign';
import ProductPricingForm from './components/Forms/ProductPricing';
import FileUploadForm from './components/Forms/FileUpload';
import ChargeCalculationForm from './components/Forms/ChargeCalculation';

const App =() => {
  return (
    <BrowserRouter>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendor-master" element={<VendorMasterForm />} />
          <Route path="/vendor-rates" element={<VendorRateForm />} />
          <Route path="/product" element={<ProductForm />} />
          <Route path="/inward" element={<InwardForm />} />
          <Route path="/outward" element={<OutwardForm />} />
          <Route path="/return" element={<ReturnForm />} />
          <Route path="/customer-onboarding" element={<CustomerOnborading />} />
          <Route path="/product-assign" element={<ProductAssignmentForm />} />
          <Route path="/product-pricing" element={<ProductPricingForm />} />
          <Route path="/file-upload" element={<FileUploadForm />} />
          <Route path="/charge-calculation" element={<ChargeCalculationForm />} />

          {/* <Route path="/product-master" element={<ProductMasterForm />} /> */}
          {/* Add other routes */}
        </Routes>
      </SidebarLayout>
    </BrowserRouter>
  );
}

export default App;