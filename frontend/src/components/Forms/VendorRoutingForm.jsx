import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const VendorRoutingForm = ({ isOpen, onClose, defaultValues = null, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: defaultValues || {
            subProduct: '',
            routingPriority1: '',
            routingPriority2: '',
            routingPriority3: ''
        }
    });

    if (!isOpen) return null;

    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {defaultValues ? 'Edit Vendor Routing' : 'Add Vendor Routing'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sub Product <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('subProduct', { required: 'Sub product is required' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Sub Product</option>
                            </select>
                            {errors.subProduct && (
                                <p className="text-red-500 text-sm mt-1">{errors.subProduct.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Routing Priority 1 <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('routingPriority1', { required: 'Routing priority 1 is required' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select</option>
                            </select>
                            {errors.routingPriority1 && (
                                <p className="text-red-500 text-sm mt-1">{errors.routingPriority1.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Routing Priority 2
                            </label>
                            <select
                                {...register('routingPriority2')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Routing Priority 3
                            </label>
                            <select
                                {...register('routingPriority3')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit(handleFormSubmit)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {defaultValues ? 'Update Routing' : 'Add Routing'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRoutingForm;