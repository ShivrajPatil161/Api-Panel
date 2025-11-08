import { lazy } from 'react';

const Dashboard = lazy(() => import('../../components/DashBoards/Dashborad.jsx'));
const CustomerOnboarding = lazy(() => import('../../components/Forms/CustomerOnboarding/CustomerOnborading.jsx'));
const VendorListPage = lazy(() => import('../../components/Tables/VendorTable.jsx'));
const Returns = lazy(() => import('../../components/Forms/Return.jsx'));
const ProductList = lazy(() => import('../../components/Tables/ProductList.jsx'));
const VendorRatesManagement = lazy(() => import('../../components/Tables/VendorRatesTable.jsx'));
const CustomerListComponent = lazy(() => import('../../components/Tables/CustomerList.jsx'));
const SchemeList = lazy(() => import('../../components/Tables/SchemeList.jsx'));
const ProductAssignment = lazy(() => import('../../components/Tables/ProductAssign_Scheme.jsx'));
const MerchantListComponent = lazy(() => import('../../components/Tables/MerchantList.jsx'));
const InventoryManagement = lazy(() => import('../../components/Inventory/Inventory.jsx'));
const CustomerProductsList = lazy(() => import('../../components/Tables/CustomerProducts/CustomerProductsList.jsx'));
const TransactionUpload = lazy(() => import('../../components/Forms/FileUpload.jsx'));
const TransactionSelectionForm = lazy(() => import('../../components/Forms/ChargeCalculation.jsx'));
const SettlementBatchStatusMonitor = lazy(() => import('../../components/Tables/SettlementBatchStatusMonitor.jsx'));
const ProductOutward = lazy(() => import('../../components/Tables/ProductOutward.jsx'));
const AdminRolesDashboard = lazy(() => import('../../components/Admin/AdminRolesDashboard.jsx'));
const BusinessLogs = lazy(() => import('../../components/Admin/BusinessLogs.jsx'));
const WalletAdjustment = lazy(() => import('../../components/Admin/WalletAdjustment.jsx'));
const ProductDistributionList = lazy(() => import('../../components/Tables/ProductDistributionList.jsx'));
const FranchiseReports = lazy(() => import('../../components/Reports/FranchiseReports.jsx'));
const VendorReports = lazy(() => import('../../components/Reports/VendorReports.jsx'));
const InwardTransactionReport = lazy(() => import('../../components/Reports/InwardTransactionReports.jsx'));
const OutwardTransactionReport = lazy(() => import('../../components/Reports/OutwardTransactionReports.jsx'));
const ReturnTransactionReport = lazy(() => import('../../components/Reports/ReturnTransactionReports.jsx'));
const ProductReport = lazy(() => import('../../components/Reports/productReports/ProductReport.jsx'));
const MTransReportDashboard = lazy(() => import('../../components/Reports/MerchantTransReport/MTransReportDashboard.jsx'));
const FTransReportDashboard = lazy(() => import('../../components/Reports/FranhiseTransReports/FTransReportDashboard.jsx'));
const MerchantReports = lazy(() => import('../../components/Reports/MerchantReports.jsx'));
const AuditHistoryComponent = lazy(() => import('../../components/Admin/AuditHistoryComponent.jsx'));
const StockReport = lazy(() => import('../../components/Reports/StockReport.jsx'));
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
        path: "products-distribution",
        element: <ProductDistributionList />
      },
      {
        path: "inward-products",
        element: <ProductOutward />
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
  // Transaction routes
  {
    path: "others",
    children: [
      {
        path: "upload",
        element: <TransactionUpload />
      },
      {
        path: "charges",
        element: <TransactionSelectionForm />
      },
      {
        path: "batch-status",
        element: <SettlementBatchStatusMonitor />
      }
    ]
  },
  {
    path: 'merchants',
    element: <MerchantListComponent />
  },
  // Reports
  {
    path: "reports",
    children: [
      {
        path: "franchise",
        element: <FranchiseReports />
      },
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
        path: "inward",
        element: <InwardTransactionReport />
      },
      {
        path: "outward",
        element: <OutwardTransactionReport />
      },
      {
        path: "return",
        element: <ReturnTransactionReport />
      },
      {
        path: "product",
        element: <ProductReport />
      },
      {
        path: "stock",
        element: <StockReport />
      }
    ]
  }
]