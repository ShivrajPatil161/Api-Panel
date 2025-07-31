import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import {
  Building2, Phone, Mail, MapPin, FileText, Calendar, 
  ToggleLeft, ToggleRight, Plus, Search, Edit, 
  Eye, Trash2, ChevronLeft, ChevronRight, Users
} from 'lucide-react';
import VendorForm from '../Forms/Vendor';


// Dummy data for vendors
const dummyVendors = [
  {
    id: 1,
    vendorName: 'HDFC Bank Solutions',
    bankName: 'HDFC Bank',
    contactPerson: 'Rajesh Kumar',
    phoneNumber: '9876543210',
    email: 'rajesh@hdfc.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    gstNumber: '27AAAAA0000A1Z5',
    panNumber: 'AAAPL1234C',
    status: 'active',
    agreementStartDate: '2024-01-01',
    agreementEndDate: '2025-12-31',
    creditPeriod: 30
  },
  {
    id: 2,
    vendorName: 'ICICI Merchant Services',
    bankName: 'ICICI Bank',
    contactPerson: 'Priya Sharma',
    phoneNumber: '9876543211',
    email: 'priya@icici.com',
    city: 'Delhi',
    state: 'Delhi',
    gstNumber: '07BBBAA0000B1Z5',
    panNumber: 'BBBPL5678D',
    status: 'active',
    agreementStartDate: '2024-02-01',
    agreementEndDate: '2025-01-31',
    creditPeriod: 45
  },
  {
    id: 3,
    vendorName: 'SBI Payment Solutions',
    bankName: 'State Bank of India',
    contactPerson: 'Amit Patel',
    phoneNumber: '9876543212',
    email: 'amit@sbi.com',
    city: 'Ahmedabad',
    state: 'Gujarat',
    gstNumber: '24CCCAA0000C1Z5',
    panNumber: 'CCCPL9012E',
    status: 'inactive',
    agreementStartDate: '2024-03-01',
    agreementEndDate: '2024-12-31',
    creditPeriod: 60
  },
  {
    id: 4,
    vendorName: 'Axis Bank Digital',
    bankName: 'Axis Bank',
    contactPerson: 'Sunita Gupta',
    phoneNumber: '9876543213',
    email: 'sunita@axis.com',
    city: 'Bangalore',
    state: 'Karnataka',
    gstNumber: '29DDDAA0000D1Z5',
    panNumber: 'DDDPL3456F',
    status: 'active',
    agreementStartDate: '2024-04-01',
    agreementEndDate: '2025-03-31',
    creditPeriod: 30
  },
  {
    id: 5,
    vendorName: 'Kotak Mahindra Tech',
    bankName: 'Kotak Mahindra Bank',
    contactPerson: 'Vikram Singh',
    phoneNumber: '9876543214',
    email: 'vikram@kotak.com',
    city: 'Pune',
    state: 'Maharashtra',
    gstNumber: '27EEEAA0000E1Z5',
    panNumber: 'EEEPL7890G',
    status: 'active',
    agreementStartDate: '2024-05-01',
    agreementEndDate: '2025-04-30',
    creditPeriod: 45
  },
  {
    id: 6,
    vendorName: 'Yes Bank Solutions',
    bankName: 'Yes Bank',
    contactPerson: 'Meera Joshi',
    phoneNumber: '9876543215',
    email: 'meera@yesbank.com',
    city: 'Chennai',
    state: 'Tamil Nadu',
    gstNumber: '33FFFAA0000F1Z5',
    panNumber: 'FFFPL2345H',
    status: 'active',
    agreementStartDate: '2024-06-01',
    agreementEndDate: '2025-05-31',
    creditPeriod: 30
  },
  {
    id: 7,
    vendorName: 'PNB Digital Services',
    bankName: 'Punjab National Bank',
    contactPerson: 'Ravi Verma',
    phoneNumber: '9876543216',
    email: 'ravi@pnb.com',
    city: 'Chandigarh',
    state: 'Punjab',
    gstNumber: '03GGGAA0000G1Z5',
    panNumber: 'GGGPL6789I',
    status: 'inactive',
    agreementStartDate: '2024-07-01',
    agreementEndDate: '2024-12-31',
    creditPeriod: 60
  },
  {
    id: 8,
    vendorName: 'Bank of Baroda Tech',
    bankName: 'Bank of Baroda',
    contactPerson: 'Kavita Reddy',
    phoneNumber: '9876543217',
    email: 'kavita@bob.com',
    city: 'Hyderabad',
    state: 'Telangana',
    gstNumber: '36HHHAA0000H1Z5',
    panNumber: 'HHHPL0123J',
    status: 'active',
    agreementStartDate: '2024-08-01',
    agreementEndDate: '2025-07-31',
    creditPeriod: 45
  },
  {
    id: 9,
    vendorName: 'Canara Bank Solutions',
    bankName: 'Canara Bank',
    contactPerson: 'Suresh Nair',
    phoneNumber: '9876543218',
    email: 'suresh@canara.com',
    city: 'Kochi',
    state: 'Kerala',
    gstNumber: '32IIIAA0000I1Z5',
    panNumber: 'IIIPL4567K',
    status: 'active',
    agreementStartDate: '2024-09-01',
    agreementEndDate: '2025-08-31',
    creditPeriod: 30
  },
  {
    id: 10,
    vendorName: 'Union Bank Digital',
    bankName: 'Union Bank of India',
    contactPerson: 'Anita Das',
    phoneNumber: '9876543219',
    email: 'anita@union.com',
    city: 'Kolkata',
    state: 'West Bengal',
    gstNumber: '19JJJAA0000J1Z5',
    panNumber: 'JJJPL8901L',
    status: 'active',
    agreementStartDate: '2024-10-01',
    agreementEndDate: '2025-09-30',
    creditPeriod: 60
  },
  {
    id: 11,
    vendorName: 'IDBI Bank Services',
    bankName: 'IDBI Bank',
    contactPerson: 'Deepak Agarwal',
    phoneNumber: '9876543220',
    email: 'deepak@idbi.com',
    city: 'Jaipur',
    state: 'Rajasthan',
    gstNumber: '08KKKAA0000K1Z5',
    panNumber: 'KKKPL2345M',
    status: 'inactive',
    agreementStartDate: '2024-11-01',
    agreementEndDate: '2024-12-31',
    creditPeriod: 45
  },
  {
    id: 12,
    vendorName: 'Indian Bank Tech',
    bankName: 'Indian Bank',
    contactPerson: 'Lakshmi Pillai',
    phoneNumber: '9876543221',
    email: 'lakshmi@indian.com',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    gstNumber: '33LLLAA0000L1Z5',
    panNumber: 'LLLPL6789N',
    status: 'active',
    agreementStartDate: '2024-12-01',
    agreementEndDate: '2025-11-30',
    creditPeriod: 30
  }
];


const VendorListPage = () => {
  const [vendors, setVendors] = useState(dummyVendors);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => `#${info.getValue()}`,
        size: 80,
      }),
      columnHelper.accessor('vendorName', {
        header: 'Vendor Name',
        cell: info => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.bankName}</div>
          </div>
        ),
      }),
      columnHelper.accessor('contactPerson', {
        header: 'Contact Person',
        cell: info => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {info.row.original.phoneNumber}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => (
          <div className="text-sm text-gray-900 flex items-center">
            <Mail className="h-3 w-3 mr-1 text-gray-400" />
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('city', {
        header: 'Location',
        cell: info => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.state}</div>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              info.getValue() === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {info.getValue() === 'active' ? 'Active' : 'Inactive'}
          </span>
        ),
      }),
      columnHelper.accessor('creditPeriod', {
        header: 'Credit Period',
        cell: info => `${info.getValue()} days`,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleView(info.row.original)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-1 text-green-600 hover:bg-green-100 rounded"
              title="Edit Vendor"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Delete Vendor"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: vendors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const handleAddVendor = () => {
    setEditingVendor(null);
    setShowForm(true);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setShowForm(true);
  };

  const handleView = (vendor) => {
    // You can implement a view modal here
    console.log('View vendor:', vendor);
    alert(`Viewing details for ${vendor.vendorName}`);
  };

  const handleDelete = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    }
  };

  const handleFormSubmit = (data) => {
    if (editingVendor) {
      // Update existing vendor
      setVendors(vendors.map(vendor => 
        vendor.id === editingVendor.id 
          ? { ...vendor, ...data }
          : vendor
      ));
    } else {
      // Add new vendor
      const newVendor = {
        ...data,
        id: Math.max(...vendors.map(v => v.id)) + 1,
      };
      setVendors([...vendors, newVendor]);
    }
    setShowForm(false);
    setEditingVendor(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingVendor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
                <p className="text-gray-600">Manage all your vendor information and relationships</p>
              </div>
            </div>
            <button
              onClick={handleAddVendor}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Vendor</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vendors.filter(v => v.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Building2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Vendors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vendors.filter(v => v.status === 'inactive').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Credit Period</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(vendors.reduce((acc, v) => acc + v.creditPeriod, 0) / vendors.length)} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Vendor List</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search vendors..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}{' '}
                  of {table.getFilteredRowModel().rows.length} results
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <VendorForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingVendor}
          isEdit={!!editingVendor}
        />
      )}
    </div>
  );
};

export default VendorListPage;