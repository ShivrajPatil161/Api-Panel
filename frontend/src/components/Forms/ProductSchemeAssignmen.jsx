
import { useForm } from 'react-hook-form'
import {  X } from 'lucide-react'

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

// ==================== PRODUCT ASSIGNMENT FORM MODAL ====================
const ProductAssignmentFormModal = ({ onCancel, onSubmit, initialData = null, isEdit = false }) => {
    const getDefaultValues = () => ({
        assignedTo: '',
        assignedType: '', // franchise or merchant
        product: '',
        scheme: '',
        effectiveDate: '',
        remarks: ''
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        defaultValues: initialData || getDefaultValues()
    })

    const assignedTypeOptions = [
        { value: 'franchise', label: 'Franchise' },
        { value: 'merchant', label: 'Merchant' }
    ]

    const productOptions = [
        { value: 'pos_machine', label: 'POS Machine' },
        { value: 'soundbox', label: 'Soundbox' },
        { value: 'qr_scanner', label: 'QR Scanner' },
        { value: 'card_reader', label: 'Card Reader' }
    ]

    const schemeOptions = [
        { value: 'SCH_001', label: 'SCH_001 - Standard Franchise' },
        { value: 'SCH_002', label: 'SCH_002 - Direct Merchant Basic' },
        { value: 'SCH_003', label: 'SCH_003 - Premium Franchise' },
        { value: 'SCH_004', label: 'SCH_004 - Mixed Card Scheme' },
        { value: 'SCH_005', label: 'SCH_005 - Comprehensive Scheme' },
        { value: 'SCH_006', label: 'SCH_006 - Budget Debit' },
        { value: 'SCH_007', label: 'SCH_007 - Premium Multi-card' }
    ]

    const onFormSubmit = (data) => {
        onSubmit(data)
        onCancel()
    }

    const handleCancel = () => {
        reset(getDefaultValues())
        onCancel()
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEdit ? 'Edit Product Assignment' : 'Add New Product Assignment'}
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                        title="Close"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Assignment Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Assignment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Assigned Type"
                                    name="assignedType"
                                    register={register}
                                    errors={errors}
                                    options={assignedTypeOptions}
                                    required
                                />
                                <Input
                                    label="Assigned To (ID/Name)"
                                    name="assignedTo"
                                    register={register}
                                    errors={errors}
                                    required
                                    placeholder="Enter franchise/merchant ID or name"
                                />
                                <Select
                                    label="Product"
                                    name="product"
                                    register={register}
                                    errors={errors}
                                    options={productOptions}
                                    required
                                />
                                <Select
                                    label="Pricing Scheme"
                                    name="scheme"
                                    register={register}
                                    errors={errors}
                                    options={schemeOptions}
                                    required
                                />
                                <Input
                                    label="Effective Date"
                                    name="effectiveDate"
                                    register={register}
                                    errors={errors}
                                    type="date"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remarks */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Remarks
                                </label>
                                <textarea
                                    {...register('remarks')}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter any additional remarks about the assignment"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit(onFormSubmit)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                {isEdit ? 'Update Assignment' : 'Save Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductAssignmentFormModal;