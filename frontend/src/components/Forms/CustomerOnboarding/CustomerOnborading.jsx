import { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from "../../../constants/API/axiosInstance"
import { toast } from 'react-toastify'
import {
  BasicDetailsForm,
  ContactDetailsForm,
  BankDetailsForm,
  DocumentsForm,
  DocumentPreview
} from './DetailsComponent'

const PartnerOnboarding = ({
  // Context props
  isModal = false,
  onClose = null,

  // Edit mode props
  isEditMode = false,
  partnerData = null,
  partnerId = null,

  // Success callback
  onSuccess = null
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [documentPreview, setDocumentPreview] = useState(null)

  // Form steps configuration
  const steps = ['Basic Details', 'Contact Details', 'Bank Details', 'Documents']
  const stepMap = {
    1: 'basic',
    2: 'contact',
    3: 'bank',
    4: 'documents'
  }

  // Form with default values for edit mode
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: isEditMode ? {
      businessName: partnerData?.businessName || '',
      legalName: partnerData?.legalName || '',
      businessType: partnerData?.businessType || '',
      gstNumber: partnerData?.gstNumber || '',
      panNumber: partnerData?.panNumber || '',
      registrationNumber: partnerData?.registrationNumber || '',
      businessAddress: partnerData?.businessAddress || partnerData?.address || '',
      primaryContactName: partnerData?.contactPerson?.name || partnerData?.primaryContactName || '',
      primaryContactMobile: partnerData?.contactPerson?.phoneNumber || partnerData?.primaryContactMobile || '',
      primaryContactEmail: partnerData?.contactPerson?.email || partnerData?.primaryContactEmail || '',
      alternateContactMobile: partnerData?.alternatePhoneNum || '',
      landlineNumber: partnerData?.landlineNumber || '',
      bankName: partnerData?.bankDetails?.bankName || '',
      accountHolderName: partnerData?.bankDetails?.accountHolderName || '',
      accountNumber: partnerData?.bankDetails?.accountNumber || '',
      ifscCode: partnerData?.bankDetails?.ifsc || '',
      branchName: partnerData?.bankDetails?.branchName || '',
      accountType: partnerData?.bankDetails?.accountType || ''
    } : {}
  })

  // Create form data for submission
  const createFormData = (data) => {
    const formDataObj = new FormData()

    // Add isApproved field
    formDataObj.append('isApproved', 'true')

    // Append text fields
    Object.keys(data).forEach(key => {
      if (data[key] && typeof data[key] === 'string') {
        formDataObj.append(key, data[key])
      }
    })

    // Append files - only new files will be sent
    const fileFields = ['panCardDocument', 'gstCertificate', 'addressProof', 'bankProof']
    fileFields.forEach(field => {
      if (data[field] && data[field][0]) {
        formDataObj.append(field, data[field][0])
      }
    })

    return formDataObj
  }

  // Handle step submission
  const handleStepSubmit = async (data) => {
    setError('')
    const updatedFormData = { ...formData, ...data }
    setFormData(updatedFormData)

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      setLoading(true)

      try {
        const formDataToSend = createFormData(updatedFormData)

        if (isEditMode) {
          // Edit mode - use PUT
          await api.put(`/partners/${partnerId}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          toast.success('Partner updated successfully!')
        } else {
          // Create mode
          await api.post('/partners', formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          toast.success('Partner added successfully!')
        }

        // Reset form
        reset()
        setFormData({})
        setCurrentStep(1)

        // Call success callback and close modal
        onSuccess?.()
        onClose?.()

      } catch (err) {
        console.error('API Error:', err)
        setError(
          err.response?.data?.message ||
          `An error occurred during ${isEditMode ? 'update' : 'submission'}. Please try again.`
        )
      } finally {
        setLoading(false)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const handleDocumentPreview = (filePath, documentName) => {
    setDocumentPreview({ documentPath: filePath, documentName })
  }

  const handleDocumentDelete = async (fieldName) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.delete(`/partners/${partnerId}/document/${fieldName}`)
        toast.success('Document deleted successfully')
        setValue(fieldName, null)
        onSuccess?.()
      } catch (error) {
        toast.error('Failed to delete document')
      }
    }
  }

  const currentStepType = stepMap[currentStep]
  const containerClass = isModal
    ? "space-y-6"
    : "max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg"

  const renderStepContent = () => {
    return (
      <form onSubmit={handleSubmit(handleStepSubmit)}>
        {/* Basic Details */}
        {currentStepType === 'basic' && (
          <BasicDetailsForm
            register={register}
            errors={errors}
          />
        )}

        {/* Contact Details */}
        {currentStepType === 'contact' && (
          <ContactDetailsForm register={register} errors={errors} />
        )}

        {/* Bank Details */}
        {currentStepType === 'bank' && (
          <BankDetailsForm register={register} errors={errors} />
        )}

        {/* Documents */}
        {currentStepType === 'documents' && (
          <DocumentsForm
            register={register}
            errors={errors}
            existingFiles={isEditMode ? partnerData?.uploadDocuments : null}
            onDocumentPreview={handleDocumentPreview}
            onDocumentDelete={isEditMode ? handleDocumentDelete : null}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (
              currentStep === steps.length
                ? (isEditMode ? 'Update Partner' : 'Add Partner')
                : 'Next Step'
            )}
          </button>
        </div>
      </form>
    )
  }

  return (
    <>
      <div className={containerClass}>
        {!isModal && (
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditMode ? 'Edit Partner' : 'Add Partner'}
          </h1>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const stepNumber = index + 1
              const isActive = stepNumber <= currentStep
              const isCompleted = stepNumber < currentStep

              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCompleted
                      ? 'bg-green-600 text-white'
                      : isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                    {isCompleted ? '✓' : stepNumber}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 text-center">{step}</span>
                </div>
              )
            })}
          </div>
          <div className="flex mt-2">
            <div
              className="h-1 bg-blue-600 transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }}
            />
            <div className="flex-1 h-1 bg-gray-200" />
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {renderStepContent()}
        </div>
      </div>

      {/* Document Preview Modal */}
      {documentPreview && (
        <DocumentPreview
          documentPath={documentPreview.documentPath}
          documentName={documentPreview.documentName}
          onClose={() => setDocumentPreview(null)}
        />
      )}
    </>
  )
}

export default PartnerOnboarding