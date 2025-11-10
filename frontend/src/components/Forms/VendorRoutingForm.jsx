import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2 } from 'lucide-react';
import { useProductQueries } from '../Hooks/useProductsQueries';
import { useVendorQueries } from '../Hooks/useVendorQueries';

// Zod schema
const vendorRuleSchema = z.object({
    vendorId: z.string().min(1, 'Vendor is required'),
    vendorName: z.string(),
    minAmount: z.string().min(1, 'Min amount required').refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Must be a valid number'),
    maxAmount: z.string().min(1, 'Max amount required').refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Must be a valid number'),
    dailyTransactionLimit: z.string().min(1, 'Transaction limit required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Must be a valid number'),
    dailyAmountLimit: z.string().min(1, 'Amount limit required').refine(val => !isNaN(Number(val)) && Number(val) >= 0, 'Must be a valid number'),
});

const formSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    vendorRules: z.array(vendorRuleSchema).min(1, 'At least one vendor required'),
});

const VendorRoutingForm = ({ isOpen, onClose, defaultValues = null, onSubmit }) => {
    const [selectedVendor, setSelectedVendor] = useState('');

    const { useAllProducts } = useProductQueries();
    const { useAllVendors } = useVendorQueries();
    const { data: productsData, isLoading: productsLoading, isError: productsError } = useAllProducts();
    const { data: vendorsData, isLoading: vendorsLoading, isError: vendorsError } = useAllVendors();

    // Initialize form hooks BEFORE any conditional returns
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            productId: '',
            vendorRules: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'vendorRules',
    });

    const vendorRules = watch('vendorRules');

    // Early returns AFTER hooks
    if (!isOpen) return null;

    if (productsLoading || vendorsLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <div className="text-center">Loading…</div>
                </div>
            </div>
        );
    }

    if (productsError || vendorsError) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <div className="text-center text-red-500">Error loading data</div>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
                </div>
            </div>
        );
    }

    const products = productsData?.content ?? [];
    const vendors = vendorsData ?? [];

    const handleAddVendor = () => {
        if (!selectedVendor) return;

        // Fix: Convert to string for comparison
        const vendorExists = fields.find(field => field.vendorId === selectedVendor);
        if (vendorExists) {
            alert('Vendor already added!');
            return;
        }

        // Fix: Compare with string version of id
        const vendor = vendors.find(v => String(v.id) === selectedVendor);

        append({
            vendorId: selectedVendor,
            vendorName: vendor?.name || '',
            minAmount: '',
            maxAmount: '',
            dailyTransactionLimit: '',
            dailyAmountLimit: '',
        });
        setSelectedVendor('');
    };

    // Fix: Convert vendor id to string for comparison
    const availableVendors = vendors.filter(v =>
        !fields.find(field => field.vendorId === String(v.id))
    );

    const onFormSubmit = (data) => {
        console.log('Form submitted:', data); // Debug log
        onSubmit(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            {defaultValues ? 'Edit Vendor Routing' : 'Add Vendor Routing'}
                        </h2>
                        <p className="text-blue-100 text-sm mt-0.5">
                            {defaultValues ? 'Update vendor routing configuration' : 'Configure vendor routing rules for product'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Product Selection */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('productId')}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                            >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>{product.productName} | {product.productCode}</option>
                                ))}
                            </select>
                            {errors.productId && (
                                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.productId.message}
                                </p>
                            )}
                        </div>

                        {/* Add Vendor Section */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-semibold text-gray-700">Vendor Rules</label>
                                <div className="flex gap-2 items-center">
                                    <select
                                        value={selectedVendor}
                                        onChange={(e) => setSelectedVendor(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white transition-all min-w-[200px]"
                                    >
                                        <option value="">Select Vendor</option>
                                        {availableVendors.map(vendor => (
                                            <option key={vendor.id} value={String(vendor.id)}>{vendor.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={handleAddVendor}
                                        disabled={!selectedVendor}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        <Plus size={16} />
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Vendor Rules List */}
                            {fields.length > 0 ? (
                                <div className="space-y-3 mt-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                    {field.vendorName}
                                                </h4>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                                        Min Amount *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register(`vendorRules.${index}.minAmount`)}
                                                        placeholder="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                    {errors.vendorRules?.[index]?.minAmount && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.vendorRules[index].minAmount.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                                        Max Amount *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register(`vendorRules.${index}.maxAmount`)}
                                                        placeholder="10000"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                    {errors.vendorRules?.[index]?.maxAmount && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.vendorRules[index].maxAmount.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                                        Daily Txn Count *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register(`vendorRules.${index}.dailyTransactionLimit`)}
                                                        placeholder="100"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                    {errors.vendorRules?.[index]?.dailyTransactionLimit && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.vendorRules[index].dailyTransactionLimit.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                                        Daily Amt Limit *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register(`vendorRules.${index}.dailyAmountLimit`)}
                                                        placeholder="50000"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                    {errors.vendorRules?.[index]?.dailyAmountLimit && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.vendorRules[index].dailyAmountLimit.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg bg-white/50 mt-4">
                                    <Plus size={24} className="mx-auto mb-2 text-gray-300" />
                                    No vendors added. Select a vendor and click Add.
                                </div>
                            )}
                            {errors.vendorRules && typeof errors.vendorRules.message === 'string' && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.vendorRules.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onFormSubmit)}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
                    >
                        {defaultValues ? 'Update Routing' : 'Add Routing'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorRoutingForm;