import { lazy } from 'react';

const Dashboard = lazy(() => import('../../components/DashBoards/Dashborad.jsx'));
const CustomerOnboarding = lazy(() => import('../../components/Forms/CustomerOnboarding/CustomerOnborading.jsx'));
const VendorListPage = lazy(() => import('../../components/Tables/VendorTable.jsx'));
const ProductList = lazy(() => import('../../components/Tables/ProductList.jsx'));
const VendorRatesManagement = lazy(() => import('../../components/Tables/VendorRatesTable.jsx'));
const CustomerListComponent = lazy(() => import('../../components/Tables/CustomerList.jsx'));
const SchemeList = lazy(() => import('../../components/Tables/SchemeList.jsx'));
const ProductAssignment = lazy(() => import('../../components/Tables/ProductAssign_Scheme.jsx'));
const CustomerProductsList = lazy(() => import('../../components/Tables/CustomerProducts/CustomerProductsList.jsx'));
const AdminRolesDashboard = lazy(() => import('../../components/Admin/AdminRolesDashboard.jsx'));
const BusinessLogs = lazy(() => import('../../components/Admin/BusinessLogs.jsx'));
const WalletAdjustment = lazy(() => import('../../components/Admin/WalletAdjustment.jsx'));
const VendorReports = lazy(() => import('../../components/Reports/VendorReports.jsx'));
const ProductReport = lazy(() => import('../../components/Reports/productReports/ProductReport.jsx'));
const MTransReportDashboard = lazy(() => import('../../components/Reports/MerchantTransReport/MTransReportDashboard.jsx'));
const FTransReportDashboard = lazy(() => import('../../components/Reports/FranhiseTransReports/FTransReportDashboard.jsx'));
const MerchantReports = lazy(() => import('../../components/Reports/MerchantReports.jsx'));
const AuditHistoryComponent = lazy(() => import('../../components/Admin/AuditHistoryComponent.jsx'));
const TaxesManagement = lazy(() => import('../../components/Admin/TaxesManagement.jsx'));
const AdminSupportTickets = lazy(() => import('../../components/Admin/AdminSupportTickets.jsx'));
const VendorCredentialsTable = lazy(() => import('../../components/Tables/VendorCredentialsTable.jsx'));
const VendorRoutingTable = lazy(() => import('../../components/Tables/VendorRoutingTable.jsx'));
const AdminBankTable = lazy(() => import('../../components/Tables/AdminBankTable.jsx'));
const PartnerCredentialTable = lazy(() => import('../../components/Tables/PartnerCredentialTable.jsx'));
const PrefundRequestsTable = lazy(() => import('../../components/Tables/PrefundRequestsTable.jsx'));



export const adminRoutes = [
  {
    index: true,
    element: <Dashboard />
  },
  {
    path: "support-ticket",
    element:<AdminSupportTickets />
  },
  {
    path: "role-management",
    element: <AdminRolesDashboard />
  },
  {
    path: "wallet-adjustment",
    element: <WalletAdjustment />
  },
  {
    path: "logs",
    element: <BusinessLogs />
  },
  {
    path: "edit-history",
    element: <AuditHistoryComponent />
  },
  {
    path: "taxes-management",
    element: <TaxesManagement />
  },
  {
    path: "admin-bank",
    element: <AdminBankTable />
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
      },
      {
        path: "credentials",
        element: <VendorCredentialsTable />
      },
      {
        path: "routing",
        element: <VendorRoutingTable />
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
        path: "customer-products",
        element: <CustomerProductsList />
      }
    ]
  },
  {
    path: "schemes",
    children: [
      {
        path: "pricing",
        element: <SchemeList />
      },
      {
        path: "products-assign",
        element: <ProductAssignment />
      },
      
      
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
        path: "pre-funding-authorization",
        element: <PrefundRequestsTable />
      },
      {
        path: "partner-credentials",
        element: <PartnerCredentialTable />
      }
    ]
  },

 
  // Reports
  {
    path: "reports",
    children: [
     
      {
        path: "merchant",
        element: <MerchantReports />
      },
      {
        path: "vendor",
        element: <VendorReports />
      },
      {
        path: "merchant-transactions",
        element: <MTransReportDashboard />
      },
      {
        path: "franchise-transactions",
        element: <FTransReportDashboard />
      },
     
      {
        path: "product",
        element: <ProductReport />
      },
    
    ]
  }
]