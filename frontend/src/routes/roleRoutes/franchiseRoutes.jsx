import Dashboard from '../../components/DashBoards/Dashborad.jsx'
import MerchantListComponent from '../../components/Tables/MerchantList.jsx'
import CustomerProductsList from '../../components/Tables/CustomerProducts/CustomerProductsList.jsx'
import ProductOutward from '../../components/Tables/ProductOutward.jsx'
import ProductDistributionList from '../../components/Tables/ProductDistributionList.jsx'
import MainReportsPageForNow from '../../components/Reports/MainReportsPageForNow.jsx'
import MTransReportDashboard from '../../components/Reports/MerchantTransReport/MTransReportDashboard.jsx'
import FTransReportDashboard from '../../components/Reports/FranhiseTransReports/FTransReportDashboard.jsx'
import Payout from '../../components/Payout/Payout.jsx'
import SupportTickets from '../../components/Tables/SupportTicket.jsx'

export const franchiseRoutes = [
  {
    index: true,
    element: <Dashboard />
  },
  {
    path: 'merchants',
    element: <MerchantListComponent />
  },
  {
    path: 'customers',
    children: [
      {
        path: 'inward-products',
        element: <ProductOutward />
      },
      {
        path: 'products-distribution',
        element: <ProductDistributionList />
      }
    ]
  },
  {
    path: 'inventory',
    children: [
      {
        path: 'customer-products',
        element: <CustomerProductsList />
      }
    ]
  },
  {
    path: 'payout',
    element: <Payout />
  },
  {
    path: 'support-ticket',
    element: <SupportTickets />
  },
  {
    path: 'reports',
    children: [
      {
        path: "merchant-transactions",
        element: <MTransReportDashboard />
      },
      {
        path: "franchise-transactions",
        element: <FTransReportDashboard />
      }
    ]
  }
]