import { CheckCircle, Globe, Key, Shield, X, XCircle } from "lucide-react"


// Utility Components
const StatusBadge = ({ isActive }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isActive
        ? 'bg-green-50 text-green-700 border-green-200'
        : 'bg-red-50 text-red-700 border-red-200'
        }`}>
        {isActive ? (
            <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
            </>
        ) : (
            <>
                <XCircle className="w-3 h-3 mr-1" />
                Inactive
            </>
        )}
    </span>
)

// View Modal Component
const PartnerCredentialView = ({ credential, onClose }) => {
    if (!credential) return null

    const InfoRow = ({ label, value, className = '' }) => (
        <div className={`${className}`}>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
        </div>
    )

    const Section = ({ title, icon: Icon, children }) => (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <Icon className="w-5 h-5 mr-2 text-blue-600" />
                {title}
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </dl>
        </div>
    )

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-auto">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Key className="h-8 w-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Credential Details</h2>
                                <p className="text-blue-100">{credential.partnerName} - {credential.productName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <Section title="Basic Information" icon={Key}>
                        <InfoRow label="Partner" value={credential.partnerName} />
                        <InfoRow label="Product" value={credential.productName} />
                        <InfoRow label="Client ID" value={credential.clientId} />
                        <InfoRow
                            label="Status"
                            value={
                                <StatusBadge isActive={credential.isActive} />
                            }
                        />
                    </Section>

                    {/* Authentication Details */}
                    <Section title="Authentication Details" icon={Shield}>
                        <InfoRow label="Token" value={credential.token || 'Not Set'} />
                        <InfoRow label="Salt Key" value={credential.saltKey || 'Not Set'} />
                        <InfoRow label="Client Secret" value={credential.clientSecret ? '••••••••' : 'Not Set'} />
                        <InfoRow label="Username" value={credential.username || 'Not Set'} />
                    </Section>

                    {/* UAT Environment */}
                    <Section title="UAT Environment" icon={Globe}>
                        <InfoRow
                            label="Token URL"
                            value={credential.tokenUrlUat}
                            className="col-span-2"
                        />
                        <InfoRow
                            label="Base URL"
                            value={credential.baseUrlUat}
                            className="col-span-2"
                        />
                    </Section>

                    {/* Production Environment */}
                    <Section title="Production Environment" icon={Globe}>
                        <InfoRow
                            label="Token URL"
                            value={credential.tokenUrlProd}
                            className="col-span-2"
                        />
                        <InfoRow
                            label="Base URL"
                            value={credential.baseUrlProd}
                            className="col-span-2"
                        />
                    </Section>

                    {/* Metadata */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow label="Created At" value={credential.createdAt} />
                            <InfoRow label="Last Updated" value={credential.updatedAt} />
                        </dl>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PartnerCredentialView