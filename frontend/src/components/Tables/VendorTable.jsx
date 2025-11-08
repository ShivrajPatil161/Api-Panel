
import React, { useState, useMemo, useEffect, lazy } from 'react';
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
  Building2, Phone, Mail, Calendar,
  Plus, Search, Edit, Eye, Trash2, ChevronLeft,
  ChevronRight, Users, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

const VendorForm = lazy(() => import('../Forms/Vendor')) ;
import VendorViewModal from '../View/VendorView';
import vendorApi from '../../constants/API/vendorApi';
import StatsCard from '../UI/StatsCard';
import PageHeader from '../UI/PageHeader';
import TableHeader from '../UI/TableHeader';
import Table from '../UI/Table';
import Pagination from '../UI/Pagination';


const VendorListPage = () => {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [viewingVendor, setViewingVendor] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const columnHelper = createColumnHelper();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const vendorData = await vendorApi.getAllVendors();
      setVendors(vendorData);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to load vendors';
      toast.error(errorMessage);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => `#${info.getValue()}`,
        size: 80,
      }),
      columnHelper.accessor('name', {
        header: 'Vendor Name',
        cell: info => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.bankType}</div>
          </div>
        ),
      }),
      // columnHelper.accessor('contactPerson.name', {
      //   header: 'Contact Person',
      //   cell: info => (
      //     <div>
      //       <div className="font-medium text-gray-900">{info.getValue()}</div>
      //       <div className="text-sm text-gray-500 flex items-center">
      //         <Phone className="h-3 w-3 mr-1" />
      //         {info.row.original.contactPerson?.phoneNumber}
      //       </div>
      //     </div>
      //   ),
      // }),
      columnHelper.accessor('contactPerson.email', {
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
            <div className="text-sm text-gray-500">{info.row.original.state || "-"}</div>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${info.getValue()
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}
          >
            {info.getValue() ? 'Active' : 'Inactive'}
          </span>
        ),
      }),
      columnHelper.accessor('creditPeriodDays', {
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
              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
              title="Edit Vendor"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id, info.row.original.name)}
              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
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
        pageSize: 10,
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
    setViewingVendor(vendor);
  };

  const handleDelete = (vendorId, vendorName) => {
    const confirmDelete = () => {
      toast.dismiss();
      performDelete(vendorId, vendorName);
    };

    const cancelDelete = () => {
      toast.dismiss();
      toast.info('Delete operation cancelled'); // ✅ Same behavior as alert version
    };

    toast.warn(
      <div className="flex flex-col space-y-2">
        <span>Delete "{vendorName}"?</span>
        <div className="flex space-x-2">
          <button
            onClick={confirmDelete}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };

  const performDelete = async (vendorId, vendorName) => {
    try {
      await vendorApi.deleteVendor(vendorId);
      loadVendors();
      toast.success(`${vendorName} deleted successfully!`);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to delete vendor';
      toast.error(errorMessage);
    }
  };

  const handleFormSubmit = async (data) => {
    const isEditing = !!editingVendor;
    const vendorName = data.name;

    try {
      if (isEditing) {
        const updatedVendor = await vendorApi.updateVendor(editingVendor.id, data);
        toast.success(`${vendorName} updated successfully!`);
      } else {
        const newVendor = await vendorApi.createVendor(data);
        
        toast.success(`${vendorName} created successfully!`);
      }
      setShowForm(false);
      setEditingVendor(null);
    } catch (error) {
      console.log(error);
      
        toast.error(
        error.response?.data?.message ||       // backend message (like 409)
        (error.request ? "No response from server" : error.message) || // network or other errors
        "An unexpected error occurred"
      );
    } finally {
      loadVendors()
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingVendor(null);
  };

  const handleViewModalClose = () => {
    setViewingVendor(null);
  };

  // Calculate stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === true).length;
  const inactiveVendors = vendors.filter(v => v.status === false).length;
  const avgCreditPeriod = totalVendors > 0
    ? Math.round(vendors.reduce((acc, v) => acc + (v.creditPeriodDays || 0), 0) / totalVendors)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading vendors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pr-4">
      <div className=" mx-auto">

        {/* Header */}
        <PageHeader
          icon={Users}
          iconColor="text-blue-600"
          title="Vendor Management"
          description="Manage all your vendor information and relationships"
          buttonText="Add Vendor"
          buttonIcon={Plus}
          onButtonClick={handleAddVendor}
          buttonColor="bg-blue-600 hover:bg-blue-700"
        />

        {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Users}
              iconColor="text-blue-600"
              bgColor="bg-blue-100"
              label="Total Vendors"
              value={totalVendors}
            />
      
            <StatsCard
              icon={Building2}
              iconColor="text-green-600"
              bgColor="bg-green-100"
              label="Active Vendors"
              value={activeVendors}
            />
      
            <StatsCard
              icon={Building2}
              iconColor="text-red-600"
              bgColor="bg-red-100"
              label="Inactive Vendors"
              value={inactiveVendors}
            />
      
            <StatsCard
              icon={Calendar}
              iconColor="text-yellow-600"
              bgColor="bg-yellow-100"
              label="Avg Credit Period"
              value={avgCreditPeriod}
              suffix=" days"
            />
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <TableHeader
            title="Vendor List"
            searchValue={globalFilter}
            onSearchChange={setGlobalFilter}
            searchPlaceholder="Search vendors..."
          />
  

          <Table
            table={table}
            columns={columns}
            emptyState={{
              icon: <Users size={50} />,
              message: "No vendors found",
              action: (
                <button
                  onClick={handleAddVendor}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Vendor
                </button>
              )
            }}
          />

          <Pagination table={table} />

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

      {/* View Modal */}
      <VendorViewModal
        vendor={viewingVendor}
        isOpen={!!viewingVendor}
        onClose={handleViewModalClose}
      />
    </div>
  );
};

export default VendorListPage;