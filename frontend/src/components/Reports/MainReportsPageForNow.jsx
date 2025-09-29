import React, { useState } from "react";
import FranchiseReports from "./FranchiseReports";
import VendorReports from "./VendorReports";
import FTransReportDashboard from "./FranhiseTransReports/FTransReportDashboard";
import MTransReportDashboard from "./MerchantTransReport/MTransReportDashboard";
import InwardTransactionReport from "./InwardTransactionReports";
import OutwardTransactionReport from "./OutwardTransactionReports";
//import ProductReport from "./productReports/ProductReport";
import ReturnTransactionReport from "./ReturnTransactionReports";
const MainReportsPageForNow = () => {
    // null = no tab selected initially
    const userType = localStorage.getItem("userType").toLowerCase()
    

    const [activeTab, setActiveTab] = useState(null);

    // Tab configuration (easy to extend later)
    const tabs = [
        {
            id: "franchise",
            label: "Franchise Reports",
            component: <FranchiseReports />,
            roles: ["super_admin", "admin"]
        },
        {
            id: "vendor",
            label: "Vendor Reports",
            component: <VendorReports />,
            roles: ["super_admin", "admin"]
        },
        {
            id: "merchant-reports",
            label: "Merchant Transaction Reports",
            component: <MTransReportDashboard />,
            roles: ["super_admin", "admin", "franchise", "merchant"]
        },
        {
            id: "franchise-reports",
            label: "Franchise Transaction Reports",
            component: <FTransReportDashboard />,
            roles: ["super_admin", "admin", "franchise"]
        },
        {
            id: "inward-transaction-reports",
            label: "Inward Transaction Reports",
            component: <InwardTransactionReport />,
            roles: ["super_admin", "admin"]
        },
        {
            id: "outward-transaction-reports",
            label: "Outward Transaction Reports",
            component: <OutwardTransactionReport />,
            roles: ["super_admin", "admin"]
        },
        {
            id: "return-transaction-reports",
            label: "Return Transaction Reports",
            component: <ReturnTransactionReport />,
            roles: ["super_admin", "admin"]
        }
    

       // { id: "product-reports", label: "Product Reports", component: <ProductReport /> } 



        // you can keep adding: { id: "sales", label: "Sales Reports", component: <SalesReports /> }
    ];

    const allowedTabs = tabs.filter(tab => tab.roles.includes(userType));
    return (
        <div className="space-y-6">
            {/* Tab headers */}
            <div className="flex gap-4 border-b border-gray-200">
                {allowedTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-medium transition-colors rounded-t-lg
        ${activeTab === tab.id
                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                : "text-gray-600 hover:text-indigo-500"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-4">
                {activeTab === null ? (
                    <div className="text-gray-500 text-center py-10">
                        Select a report tab to view data
                    </div>
                ) : (
                    allowedTabs.find(tab => tab.id === activeTab)?.component
                )}
            </div>

        </div>
    );
};

export default MainReportsPageForNow;
