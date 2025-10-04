import Dashboard from '../../components/DashBoards/Dashborad.jsx'
import CustomerOnboarding from '../../components/Forms/CustomerOnboarding/CustomerOnborading.jsx'
import VendorListPage from '../../components/Tables/VendorTable.jsx'
import Returns from '../../components/Forms/Return.jsx'
import ProductList from '../../components/Tables/ProductList.jsx'
import VendorRatesManagement from '../../components/Tables/VendorRatesTable.jsx'
import CustomerListComponent from '../../components/Tables/CustomerList.jsx'
import SchemeList from '../../components/Tables/SchemeList.jsx'
import ProductAssignment from '../../components/Tables/ProductAssign_Scheme.jsx'
import MerchantListComponent from '../../components/Tables/MerchantList.jsx'
import VendorProductUploadForm from '../../components/Forms/FileUpload.jsx'
import AdminApproval from '../../components/Admin/AdminApproval.jsx'
import InventoryManagement from '../../components/Inventory/Inventory.jsx'
import CustomerProductsList from '../../components/Tables/CustomerProducts/CustomerProductsList.jsx'
import TransactionUpload from '../../components/Forms/FileUpload.jsx'
import TransactionSelectionForm from '../../components/Forms/ChargeCalculation.jsx'
import SettlementBatchStatusMonitor from '../../components/Tables/SettlementBatchStatusMonitor.jsx'
import ProductOutward from '../../components/Tables/ProductOutward.jsx'
import MainReportsPageForNow from '../../components/Reports/MainReportsPageForNow.jsx'
import AdminRolesDashboard from '../../components/Admin/AdminRolesDashboard.jsx'
import BusinessLogs from '../../components/Admin/BusinessLogs.jsx'
import WalletAdjustment from '../../components/Admin/WalletAdjustment.jsx'
import ProductDistributionList from '../../components/Tables/ProductDistributionList.jsx'
import FranchiseReports from '../../components/Reports/FranchiseReports.jsx'
import VendorReports from '../../components/Reports/VendorReports.jsx'
import MerchantTransactionReports from '../../components/Reports/MerchantTransReport/MerchantTransactionReports.jsx'
import FranchiseTransactionReport from '../../components/Reports/FranhiseTransReports/FranchiseTransactionReports.jsx'
import InwardTransactionReport from '../../components/Reports/InwardTransactionReports.jsx'
import OutwardTransactionReport from '../../components/Reports/OutwardTransactionReports.jsx'
import ReturnTransactionReport from '../../components/Reports/ReturnTransactionReports.jsx'
import ProductReport from '../../components/Reports/productReports/ProductReport.jsx'
import MTransReportDashboard from '../../components/Reports/MerchantTransReport/MTransReportDashboard.jsx'
import FTransReportDashboard from '../../components/Reports/FranhiseTransReports/FTransReportDashboard.jsx'

export const adminRoutes = [
  {
    index: true,
    element: <Dashboard />
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
        element: <ProductDistributionList />
      },
      {
        path: "inward-products",
        element: <ProductOutward />
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
      }
    ]
  }
]