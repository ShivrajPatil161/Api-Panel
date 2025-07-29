import React from "react"

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Vendors" value="3" />
        <StatCard label="Products in Stock" value="125" />
        <StatCard label="Franchises" value="12" />
        <StatCard label="Merchants" value="47" />
      </div>

      {/* Vendor Table */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Vendors Summary</h2>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full text-left text-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">Vendor Name</th>
                <th className="p-2">Bank</th>
                <th className="p-2">Email</th>
                <th className="p-2">Total Products</th>
              </tr>
            </thead>
            <tbody>
              {dummyVendors.map((vendor, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{vendor.name}</td>
                  <td className="p-2">{vendor.bank}</td>
                  <td className="p-2">{vendor.email}</td>
                  <td className="p-2">{vendor.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Dummy stat card component
const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
)

export default Dashboard

// Dummy vendor data
const dummyVendors = [
  {
    name: "Acme Tech Solutions",
    bank: "Axis Bank",
    email: "acme@vendor.com",
    products: 40
  },
  {
    name: "SwiftPOS Systems",
    bank: "HDFC",
    email: "swift@vendor.com",
    products: 55
  },
  {
    name: "NeoBank Devices Pvt Ltd",
    bank: "ICICI",
    email: "neo@vendor.com",
    products: 30
  }
]
