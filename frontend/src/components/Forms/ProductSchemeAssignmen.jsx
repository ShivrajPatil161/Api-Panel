import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from "../../constants/API/axiosInstance"

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
    const [franchises, setFranchises] = useState([])
    const [merchants, setMerchants] = useState([])
    const [franchiseProducts, setFranchiseProducts] = useState([])
    const [merchantProducts, setMerchantProducts] = useState([])
    const [pricingSchemes, setPricingSchemes] = useState([])
    const [loading, setLoading] = useState(false)

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
        reset,
        setValue
    } = useForm({
        defaultValues: initialData || getDefaultValues()
    })

    const watchedFields = watch(['assignedType', 'assignedTo', 'product'])

    // Fetch franchises or merchants when assigned type is selected
    useEffect(() => {
        const fetchAssignedToOptions = async () => {
            if (!watchedFields[0]) return

            try {
                setLoading(true)
                if (watchedFields[0] === 'franchise') {
                    const response = await api.get('/franchise')
                    setFranchises(response.data)
                    setMerchants([]) // Clear merchants
                } else if (watchedFields[0] === 'merchant') {
                    const response = await api.get('/merchants/direct-merchant')
                    setMerchants(response.data)
                    setFranchises([]) // Clear franchises
                }
            } catch (error) {
                console.error(`Error fetching ${watchedFields[0]}s:`, error)
                if (watchedFields[0] === 'franchise') {
                    setFranchises([])
                } else {
                    setMerchants([])
                }
            } finally {
                setLoading(false)
            }
        }
        fetchAssignedToOptions()
    }, [watchedFields[0]])

    // Fetch franchise products when franchise is selected
    useEffect(() => {
        const fetchFranchiseProducts = async () => {
            if (watchedFields[0] === 'franchise' && watchedFields[1]) {
                try {
                    setLoading(true)
                    const response = await api.get(`/franchise/products/${watchedFields[1]}`)
                    setFranchiseProducts(response.data)
                } catch (error) {
                    console.error('Error fetching franchise products:', error)
                    setFranchiseProducts([])
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchFranchiseProducts()
    }, [watchedFields[0], watchedFields[1]])

    // Fetch merchant products when merchant is selected
    useEffect(() => {
        const fetchMerchantProducts = async () => {
            if (watchedFields[0] === 'merchant' && watchedFields[1]) {
                try {
                    setLoading(true)
                    const response = await api.get(`/merchants/products/${watchedFields[1]}`)
                    setMerchantProducts(response.data)
                } catch (error) {
                    console.error('Error fetching merchant products:', error)
                    setMerchantProducts([])
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchMerchantProducts()
    }, [watchedFields[0], watchedFields[1]])

    // Fetch pricing schemes when product is selected
    useEffect(() => {
        const fetchPricingSchemes = async () => {
            if (watchedFields[2] && watchedFields[0]) {
                try {
                    setLoading(true)
                    const selectedProduct = watchedFields[0] === 'franchise'
                        ? franchiseProducts.find(p => p.productId.toString() === watchedFields[2])
                        : merchantProducts.find(p => p.productId.toString() === watchedFields[2])

                    if (selectedProduct) {
                        const customerType = watchedFields[0] === 'franchise' ? 'franchise' : 'direct_merchant'
                        const response = await api.get(
                            `/pricing-schemes/valid-pricing-scheme?productId=${selectedProduct.productId}&productCategory=${selectedProduct.productCategory}&customerType=${customerType}`
                        )
                        setPricingSchemes(response.data)
                    }
                } catch (error) {
                    console.error('Error fetching pricing schemes:', error)
                    setPricingSchemes([])
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchPricingSchemes()
    }, [watchedFields[2], watchedFields[0], franchiseProducts, merchantProducts])

    // Reset dependent fields when assigned type changes
    useEffect(() => {
        if (watchedFields[0]) {
            setValue('assignedTo', '')
            setValue('product', '')
            setValue('scheme', '')
            setFranchiseProducts([])
            setMerchantProducts([])
            setPricingSchemes([])
        }
    }, [watchedFields[0], setValue])

    const assignedTypeOptions = [
        { value: 'franchise', label: 'Franchise' },
        { value: 'merchant', label: 'Merchant' }
    ]

    // Dynamic options based on assigned type
    const getAssignedToOptions = () => {
        if (watchedFields[0] === 'franchise') {
            return franchises.map(franchise => ({
                value: franchise.id.toString(),
                label: `${franchise.franchiseName} (ID: ${franchise.id})`
            }))
        } else if (watchedFields[0] === 'merchant') {
            return merchants.map(merchant => ({
                value: merchant.id.toString(),
                label: `${merchant.businessName} (ID: ${merchant.id})`
            }))
        }
        return []
    }

    const getProductOptions = () => {
        const products = watchedFields[0] === 'franchise' ? franchiseProducts : merchantProducts
        return products.map(product => ({
            value: product.productId.toString(),
            label: `${product.productName} (${product.productCode}) - Qty: ${product.totalQuantity}`
        }))
    }

    const getSchemeOptions = () => {
        return pricingSchemes.map(scheme => ({
            value: scheme.id.toString(),
            label: `${scheme.schemeCode} - ₹${scheme.rentalByMonth}/month`
        }))
    }

    const onFormSubmit = async (data) => {
        try {
            setLoading(true)
            const selectedProduct = watchedFields[0] === 'franchise'
                ? franchiseProducts.find(p => p.productId.toString() === data.product)
                : merchantProducts.find(p => p.productId.toString() === data.product)

            const assignmentData = {
                customerType: data.assignedType,
                customerId: parseInt(data.assignedTo),
                productId: parseInt(data.product),
                schemeId: parseInt(data.scheme),
                effectiveDate: data.effectiveDate,
                remarks: data.remarks,
                outwardId: selectedProduct?.outwardId || null
            }

            let response
            if (isEdit && initialData?.id) {
                // 🔹 UPDATE (PUT)
                response = await api.put(`/outward-schemes/${initialData.id}`, assignmentData)
            } else {
                // 🔹 CREATE (POST)
                response = await api.post('/outward-schemes', assignmentData)
            }

            onSubmit(response.data)
            onCancel()
        } catch (error) {
            console.error('Error saving assignment:', error)
            // TODO: show toast/notification
        } finally {
            setLoading(false)
        }
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
                                <Select
                                    label="Assigned To"
                                    name="assignedTo"
                                    register={register}
                                    errors={errors}
                                    options={getAssignedToOptions()}
                                    required
                                    disabled={!watchedFields[0]}
                                />
                                <Select
                                    label="Product"
                                    name="product"
                                    register={register}
                                    errors={errors}
                                    options={getProductOptions()}
                                    required
                                    disabled={!watchedFields[1] || loading}
                                />
                                <Select
                                    label="Pricing Scheme"
                                    name="scheme"
                                    register={register}
                                    errors={errors}
                                    options={getSchemeOptions()}
                                    required
                                    disabled={!watchedFields[2] || loading}
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
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit(onFormSubmit)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (isEdit ? 'Update Assignment' : 'Save Assignment')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductAssignmentFormModal;