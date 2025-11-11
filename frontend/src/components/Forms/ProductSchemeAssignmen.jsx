import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from "../../constants/API/axiosInstance"
import { toast } from 'react-toastify'
import { usePartners, useProducts, useValidSchemes, useCreateAssignment, useUpdateAssignment } from '../hooks/usePartnerSchemes'
import { partnerSchemeApi } from '../../constants/API/partnerSchemeApi' 


// ==================== FORM COMPONENTS ====================

const Input = ({ label, name, register, errors, required = false, type = "text", ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            {...register(name, {
                required: required ? `${label} is required` : false,
            })}
            type={type}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'
                }`}
            {...props}
        />
        {errors[name] && (
            <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
        )}
    </div>
)

const Select = ({ label, name, register, errors, options, required = false, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            {...register(name, { required: required ? `${label} is required` : false })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'
                }`}
            {...props}
        >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {errors[name] && (
            <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
        )}
    </div>
)

// ==================== UPDATED PRODUCT ASSIGNMENT FORM MODAL ====================


const ProductAssignmentFormModal = ({ onCancel, onSubmit, initialData = null, isEdit = false }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        defaultValues: {
            customerId: initialData?.apiPartnerId?.toString() || '',
            productId: initialData?.productId?.toString() || '',
            schemeId: initialData?.schemeId?.toString() || '',
            effectiveDate: initialData?.effectiveDate || '',
            expiryDate: initialData?.expiryDate || '',
            remarks: initialData?.remarks || ''
        }
    })

    const [customerId, productId, schemeId] = watch(['customerId', 'productId', 'schemeId'])

    // Mutations
    const createMutation = useCreateAssignment()
    const updateMutation = useUpdateAssignment()

    // Fetch data
    const { data: partners = [], isLoading: loadingPartners } = usePartners()
    const { data: products = [], isLoading: loadingProducts } = useProducts()

    const selectedProduct = products.find(p => p.id.toString() === productId)
    const {
        data: schemesData,
        isLoading: loadingSchemes
    } = useValidSchemes(
        selectedProduct?.id,
        selectedProduct?.productCategory?.categoryName,
        !!selectedProduct
    )

    const schemes = schemesData?.schemes || []
    const globalWarning = schemesData?.globalWarning || null
    const selectedScheme = schemes.find(s => s.schemeId.toString() === schemeId)
    const selectedSchemeWarning = selectedScheme?.warning || null

    // FIX: Re-set schemeId when schemes load in edit mode
    useEffect(() => {
        if (isEdit && initialData?.schemeId && schemes.length > 0) {
            const schemeExists = schemes.some(s => s.schemeId.toString() === initialData.schemeId.toString())
            if (schemeExists) {
                setValue('schemeId', initialData.schemeId.toString())
            }
        }
    }, [schemes.length, isEdit, initialData?.schemeId, setValue])

    // Clear dependent fields on parent change (only in add mode)
    // useEffect(() => {
    //     if (!isEdit && customerId) {
    //         setValue('productId', '')
    //         setValue('schemeId', '')
    //     }
    // }, [customerId, isEdit, setValue])

    // useEffect(() => {
    //     if (!isEdit && productId) {
    //         setValue('schemeId', '')
    //     }
    // }, [productId, isEdit, setValue])

    // Form submission
    const onFormSubmit = async (data) => {
        const assignmentData = {
            apiPartnerId: parseInt(data.customerId),
            productId: parseInt(data.productId),
            schemeId: parseInt(data.schemeId),
            effectiveDate: data.effectiveDate,
            expiryDate: data.expiryDate || null,
            remarks: data.remarks || null
        }

        if (isEdit && initialData?.id) {
            await updateMutation.mutateAsync({ id: initialData.id, data: assignmentData })
        } else {
            await createMutation.mutateAsync(assignmentData)
        }

        onSubmit()
        onCancel()
    }

    const isSubmitting = createMutation.isPending || updateMutation.isPending

    // Show loading only when fetching initial data in edit mode
    if (isEdit && loadingPartners) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading assignment data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEdit ? 'Edit Customer Scheme Assignment' : 'Add New Customer Scheme Assignment'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                        disabled={isSubmitting}
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Assignment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Customer"
                                    name="customerId"
                                    register={register}
                                    errors={errors}
                                    options={partners.map(c => ({
                                        value: c.id.toString(),
                                        label: `${c.businessName} (ID: ${c.id})`
                                    }))}
                                    required
                                    disabled={loadingPartners || isSubmitting}
                                />
                                <Select
                                    label="Product"
                                    name="productId"
                                    register={register}
                                    errors={errors}
                                    options={products.map(p => ({
                                        value: p.id.toString(),
                                        label: `${p.productName} (${p.productCode})`
                                    }))}
                                    required
                                    disabled={!customerId || loadingProducts || isSubmitting}
                                />
                                <Select
                                    label="Pricing Scheme"
                                    name="schemeId"
                                    register={register}
                                    errors={errors}
                                    options={schemes.map(s => ({
                                        value: s.schemeId.toString(),
                                        label: `${s.schemeCode} - ₹${s.monthlyRent}/month`
                                    }))}
                                    required
                                    disabled={!productId || loadingSchemes || isSubmitting}
                                />
                                <Input
                                    label="Effective Date"
                                    name="effectiveDate"
                                    register={register}
                                    errors={errors}
                                    type="date"
                                    required
                                    disabled={isSubmitting}
                                />
                                <Input
                                    label="Expiry Date"
                                    name="expiryDate"
                                    register={register}
                                    errors={errors}
                                    type="date"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <textarea
                                {...register('remarks')}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Enter any additional remarks"
                                disabled={isSubmitting}
                            />
                        </div>

                        {globalWarning && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700 font-medium">Vendor Rate Warning</p>
                                        <p className="text-sm text-yellow-700 mt-1">{globalWarning}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedSchemeWarning && (
                            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-md">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-orange-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-orange-700 font-medium">Pricing Scheme Warning</p>
                                        <p className="text-sm text-orange-700 mt-1">{selectedSchemeWarning}</p>
                                        <p className="text-xs text-orange-600 mt-2 italic">
                                            This scheme can still be assigned, but the rates are below vendor costs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : (isEdit ? 'Update Assignment' : 'Save Assignment')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductAssignmentFormModal