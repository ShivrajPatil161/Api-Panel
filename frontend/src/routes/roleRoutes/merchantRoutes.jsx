import Dashboard from '../../components/DashBoards/Dashborad.jsx'
import CustomerProductsList from '../../components/Tables/CustomerProducts/CustomerProductsList.jsx'
import ProductOutward from '../../components/Tables/ProductOutward.jsx'
import MainReportsPageForNow from '../../components/Reports/MainReportsPageForNow.jsx'
import Payout from '../../components/Payout/Payout.jsx'
import CreditCardBillPayment from '../../components/Payout/CreditCardBillPayment.jsx'
import MTransReportDashboard from '../../components/Reports/MerchantTransReport/MTransReportDashboard.jsx'
import ViewProfile from '../../components/layout/ViewProfile.jsx'
import SupportTickets from '../../components/Tables/SupportTicket.jsx'
import PreFundAuthTable from '../../components/Tables/PreFundAuthTable.jsx'
import PrefundRequestsTable from '../../components/Tables/PrefundRequestsTable.jsx'

export const merchantRoutes = [
  {
    index: true,
    element: <Dashboard />
  },
  {
    path: 'customers',
    children: [
      {
        path: 'inward-products',
        element: <ProductOutward />
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
    path: 'credit-card-bill-payment',
    element: <CreditCardBillPayment />
  },
  {
    path: 'payout',
    element: <Payout />
  },
  {
    path: 'pre-funding-auth',
    element: <PrefundRequestsTable />
  },
  {
    path: 'profile',
    element: <ViewProfile />
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
      }
    ]
  }
]