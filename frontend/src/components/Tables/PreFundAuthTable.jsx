import React, { useState, useMemo, useEffect } from 'react';
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
  FileText, Search, ChevronLeft, ChevronRight,
  Loader2, CheckCircle, XCircle, Clock, Eye,
  Download, DollarSign, Calendar, User, Smartphone
} from 'lucide-react';
import { toast } from 'react-toastify';

const PrefundingAuthorizationTable = () => {
  const [requests, setRequests] = useState([]);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const columnHelper = createColumnHelper();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      // Replace with your API call
      // const requestData = await prefundingApi.getAllRequests();
      // setRequests(requestData);
      
      // Mock data for demonstration
      setRequests([]);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to load prefunding requests';
      toast.error(errorMessage);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (requestId, transactionId) => {
    const confirmApprove = () => {
      toast.dismiss();
      performApprove(requestId, transactionId);
    };

    const cancelApprove = () => {
      toast.dismiss();
      toast.info('Approval cancelled');
    };

    toast.info(
      <div className="flex flex-col space-y-2">
        <span>Approve request for Transaction ID: {transactionId}?</span>
        <div className="flex space-x-2">
          <button
            onClick={confirmApprove}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={cancelApprove}
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

  const handleReject = (requestId, transactionId) => {
    const confirmReject = () => {
      toast.dismiss();
      performReject(requestId, transactionId);
    };

    const cancelReject = () => {
      toast.dismiss();
      toast.info('Rejection cancelled');
    };

    toast.warn(
      <div className="flex flex-col space-y-2">
        <span>Reject request for Transaction ID: {transactionId}?</span>
        <div className="flex space-x-2">
          <button
            onClick={confirmReject}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={cancelReject}
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

  const performApprove = async (requestId, transactionId) => {
    try {
      // Replace with your API call
      // await prefundingApi.approveRequest(requestId);
      loadRequests();
      toast.success(`Request ${transactionId} approved successfully!`);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to approve request';
      toast.error(errorMessage);
    }
  };

  const performReject = async (requestId, transactionId) => {
    try {
      // Replace with your API call
      // await prefundingApi.rejectRequest(requestId);
      loadRequests();
      toast.success(`Request ${transactionId} rejected successfully!`);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to reject request';
      toast.error(errorMessage);
    }
  };

  const handleViewDepositSlip = (depositSlipUrl) => {
    if (depositSlipUrl) {
      window.open(depositSlipUrl, '_blank');
    } else {
      toast.error('Deposit slip not available');
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: info => (
          <div className="flex space-x-2">
            {info.row.original.requestStatus === 'Pending' && (
              <>
                <button
                  onClick={() => handleApprove(info.row.original.id, info.row.original.transactionId)}
                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleReject(info.row.original.id, info.row.original.transactionId)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Reject"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setViewingRequest(info.row.original)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
      columnHelper.accessor('depositType', {
        header: 'Deposit Type',
        cell: info => (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('transactionId', {
        header: 'Transaction ID',
        cell: info => (
          <div className="font-medium text-gray-900">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: info => (
          <div className="flex items-center text-gray-900 font-semibold">
            <DollarSign className="h-4 w-4 mr-1 text-green-600" />
            {parseFloat(info.getValue()).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
        ),
      }),
      columnHelper.accessor('accountNumber', {
        header: 'Account Number',
        cell: info => (
          <div className="font-mono text-sm text-gray-900">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('depositDate', {
        header: 'Deposit Date',
        cell: info => (
          <div className="flex items-center text-sm text-gray-900">
            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
            {new Date(info.getValue()).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        ),
      }),
      columnHelper.accessor('depositSlip', {
        header: 'Deposit Slip',
        cell: info => (
          <button
            onClick={() => handleViewDepositSlip(info.getValue())}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
            disabled={!info.getValue()}
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">View</span>
          </button>
        ),
      }),
      columnHelper.accessor('requestedBy', {
        header: 'Requested By',
        cell: info => (
          <div className="flex items-center text-sm text-gray-900">
            <User className="h-3 w-3 mr-1 text-gray-400" />
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('clientIp', {
        header: 'Client IP',
        cell: info => (
          <div className="font-mono text-xs text-gray-600">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('partnerMobileNumber', {
        header: 'Partner Mobile Number',
        cell: info => (
          <div className="flex items-center text-sm text-gray-900">
            <Smartphone className="h-3 w-3 mr-1 text-gray-400" />
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('requestStatus', {
        header: 'Request Status',
        cell: info => {
          const status = info.getValue();
          const statusConfig = {
            Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            Approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            Rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
          };
          const config = statusConfig[status] || statusConfig.Pending;
          const StatusIcon = config.icon;

          return (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status}
            </span>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: requests,
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

  // Calculate stats
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.requestStatus === 'Pending').length;
  const approvedRequests = requests.filter(r => r.requestStatus === 'Approved').length;
  const rejectedRequests = requests.filter(r => r.requestStatus === 'Rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading prefunding requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pr-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prefunding Requests</h1>
                <p className="text-gray-600">Review and authorize prefunding deposit requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Request List</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search requests..."
                />
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
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
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <FileText className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">No prefunding requests found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {table.getRowModel().rows.length > 0 && (
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
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </span>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-medium text-gray-900">{viewingRequest.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-gray-900">₹{parseFloat(viewingRequest.amount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deposit Type</p>
                  <p className="font-medium text-gray-900">{viewingRequest.depositType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium text-gray-900">{viewingRequest.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deposit Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(viewingRequest.depositDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-gray-900">{viewingRequest.requestStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requested By</p>
                  <p className="font-medium text-gray-900">{viewingRequest.requestedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Partner Mobile</p>
                  <p className="font-medium text-gray-900">{viewingRequest.partnerMobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Client IP</p>
                  <p className="font-medium text-gray-900">{viewingRequest.clientIp}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingRequest(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrefundingAuthorizationTable;