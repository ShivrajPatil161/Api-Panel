// import React from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// // Sample product options – replace with dynamic list from DB/API
// const products = ["Swap Machine", "QR Code", "QR + Soundbox"];

// const ProductPricingForm = () => {
//   const initialValues = {
//     pricingCode: '',
//     product: '',
//     basePrice: '',
//     gstPercentage: '',
//     effectiveFrom: '',
//     description: ''
//   };

//   const validationSchema = Yup.object({
//     pricingCode: Yup.string().required("Pricing Code is required"),
//     product: Yup.string().required("Product is required"),
//     basePrice: Yup.number().required("Base price is required").min(0, "Must be a positive number"),
//     gstPercentage: Yup.number().required("GST % is required").min(0).max(100),
//     effectiveFrom: Yup.date().required("Effective date is required"),
//     description: Yup.string()
//   });

//   const onSubmit = (values, { resetForm }) => {
//     console.log("Product Pricing Master Submitted:", values);
//     resetForm();
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-xl">
//       <h2 className="text-xl font-bold mb-4">Product Pricing Master Form</h2>
//       <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
//         <Form className="space-y-4">
//           {/* Pricing Code */}
//           <div>
//             <label className="block mb-1">Pricing Code</label>
//             <Field name="pricingCode" type="text" className="w-full border rounded p-2" />
//             <ErrorMessage name="pricingCode" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Product */}
//           <div>
//             <label className="block mb-1">Product</label>
//             <Field name="product" as="select" className="w-full border rounded p-2">
//               <option value="">Select Product</option>
//               {products.map((p, i) => (
//                 <option key={i} value={p}>{p}</option>
//               ))}
//             </Field>
//             <ErrorMessage name="product" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Base Price */}
//           <div>
//             <label className="block mb-1">Base Price (₹)</label>
//             <Field name="basePrice" type="number" className="w-full border rounded p-2" />
//             <ErrorMessage name="basePrice" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* GST Percentage */}
//           <div>
//             <label className="block mb-1">GST (%)</label>
//             <Field name="gstPercentage" type="number" className="w-full border rounded p-2" />
//             <ErrorMessage name="gstPercentage" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Effective From */}
//           <div>
//             <label className="block mb-1">Effective From</label>
//             <Field name="effectiveFrom" type="date" className="w-full border rounded p-2" />
//             <ErrorMessage name="effectiveFrom" component="div" className="text-red-600 text-sm" />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block mb-1">Description (optional)</label>
//             <Field name="description" as="textarea" className="w-full border rounded p-2" />
//           </div>

//           <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
//             Submit
//           </button>
//         </Form>
//       </Formik>
//     </div>
//   );
// };

// export default ProductPricingForm;

import React, { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  DollarSign, Package, Users, Plus, Search, Edit, Eye, Trash2, 
  ChevronLeft, ChevronRight, Tag, Calculator, TrendingUp,
  Building2, Calendar, ToggleLeft, ToggleRight, X, Save
} from 'lucide-react';
import PricingForm from './PricingForm';





// Dummy pricing data
const dummyPricingData = [
  {
    id: 1,
    productName: 'mPOS Terminal Pro',
    productCategory: 'pos_machine',
    vendorName: 'HDFC Bank Solutions',
    sku: 'HDFC-MPOS-001',
    basePrice: 8500,
    costPrice: 7500,
    sellingPrice: 9500,
    markup: 12.5,
    status: 'active',
    effectiveDate: '2024-01-01',
    specialRates: { franchiseRate: 9000, merchantRate: 9500, bulkOrderRate: 8800 }
  },
  {
    id: 2,
    productName: 'QR Code Scanner HD',
    productCategory: 'qr_scanner',
    vendorName: 'ICICI Merchant Services',
    sku: 'ICICI-QR-HD001',
    basePrice: 3500,
    costPrice: 3000,
    sellingPrice: 4200,
    markup: 20,
    status: 'active',
    effectiveDate: '2024-01-15',
    specialRates: { franchiseRate: 3800, merchantRate: 4200, bulkOrderRate: 3600 }
  },
  {
    id: 3,
    productName: 'Card Reader Compact',
    productCategory: 'card_reader',
    vendorName: 'SBI Payment Solutions',
    sku: 'SBI-CR-COMP01',
    basePrice: 2800,
    costPrice: 2400,
    sellingPrice: 3300,
    markup: 15,
    status: 'active',
    effectiveDate: '2024-02-01',
    specialRates: { franchiseRate: 3000, merchantRate: 3300, bulkOrderRate: 2900 }
  },
  {
    id: 4,
    productName: 'Mobile POS Elite',
    productCategory: 'mobile_pos',
    vendorName: 'Axis Bank Digital',
    sku: 'AXIS-MPOS-ELT',
    basePrice: 12000,
    costPrice: 10500,
    sellingPrice: 14000,
    markup: 16.67,
    status: 'inactive',
    effectiveDate: '2024-01-10',
    specialRates: { franchiseRate: 13000, merchantRate: 14000, bulkOrderRate: 12500 }
  },
  {
    id: 5,
    productName: 'USB Cable Set',
    productCategory: 'accessories',
    vendorName: 'Kotak Mahindra Tech',
    sku: 'KOT-USB-SET01',
    basePrice: 450,
    costPrice: 350,
    sellingPrice: 600,
    markup: 25,
    status: 'active',
    effectiveDate: '2024-01-01',
    specialRates: { franchiseRate: 550, merchantRate: 600, bulkOrderRate: 500 }
  }
];



const ProductPricingPage = () => {
  const [pricingData, setPricingData] = useState(dummyPricingData);
  const [showForm, setShowForm] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => `#${info.getValue()}`,
        size: 80,
      }),
      columnHelper.accessor('productName', {
        header: 'Product',
        cell: info => (
          <div>
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500 capitalize">
              {info.row.original.productCategory.replace('_', ' ')}
            </div>
            <div className="text-xs text-gray-400">{info.row.original.sku}</div>
          </div>
        ),
      }),
      columnHelper.accessor('vendorName', {
        header: 'Vendor',
        cell: info => (
          <div className="font-medium text-gray-900">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor('costPrice', {
        header: 'Cost Price',
        cell: info => (
          <div className="font-medium text-gray-900">₹{info.getValue().toLocaleString()}</div>
        ),
      }),
      columnHelper.accessor('sellingPrice', {
        header: 'Selling Price',
        cell: info => (
          <div className="font-medium text-green-600">₹{info.getValue().toLocaleString()}</div>
        ),
      }),
      columnHelper.accessor('markup', {
        header: 'Markup',
        cell: info => (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {info.getValue()}%
          </span>
        ),
      }),
      columnHelper.accessor('specialRates', {
        header: 'Special Rates',
        cell: info => (
          <div className="text-xs space-y-1">
            <div>Franchise: ₹{info.getValue().franchiseRate.toLocaleString()}</div>
            <div>Merchant: ₹{info.getValue().merchantRate.toLocaleString()}</div>
            <div>Bulk: ₹{info.getValue().bulkOrderRate.toLocaleString()}</div>
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
              title="Edit Pricing"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
              title="Delete Pricing"
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
    data: pricingData,
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

  const handleAddPricing = () => {
    setEditingPricing(null);
    setShowForm(true);
  };

  const handleEdit = (pricing) => {
    setEditingPricing(pricing);
    setShowForm(true);
  };

  const handleView = (pricing) => {
    console.log('View pricing:', pricing);
    alert(`Viewing pricing details for ${pricing.productName}`);
  };

  const handleDelete = (pricingId) => {
    if (window.confirm('Are you sure you want to delete this pricing?')) {
      setPricingData(pricingData.filter(pricing => pricing.id !== pricingId));
    }
  };

  const handleFormSubmit = (data) => {
    if (editingPricing) {
      // Update existing pricing
      setPricingData(pricingData.map(pricing => 
        pricing.id === editingPricing.id 
          ? { ...pricing, ...data }
          : pricing
      ));
    } else {
      // Add new pricing
      const newPricing = {
        ...data,
        id: Math.max(...pricingData.map(p => p.id)) + 1,
      };
      setPricingData([...pricingData, newPricing]);
    }
    setShowForm(false);
    setEditingPricing(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPricing(null);
  };

  // Calculate stats
  const totalProducts = pricingData.length;
  const activeProducts = pricingData.filter(p => p.status === 'active').length;
  const avgMarkup = pricingData.reduce((acc, p) => acc + p.markup, 0) / pricingData.length;
  const totalValue = pricingData.reduce((acc, p) => acc + p.sellingPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Pricing Management</h1>
                <p className="text-gray-600">Manage pricing for all your products and services</p>
              </div>
            </div>
            <button
              onClick={handleAddPricing}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Pricing</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Markup</p>
                <p className="text-2xl font-bold text-gray-900">{avgMarkup.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Product Pricing List</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search products..."
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
        <PricingForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingPricing}
          isEdit={!!editingPricing}
        />
      )}
    </div>
  );
};

export default ProductPricingPage;