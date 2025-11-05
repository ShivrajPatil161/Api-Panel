import { useState } from "react";
import { X, FileText, ImageIcon, Wallet, TrendingUp, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { fileApi, handleApiError } from '../../constants/API/customerApi'
import { DocumentPreview } from "../Forms/CustomerOnboarding/DetailsComponent";

const PartnerView = ({ apiPartner, onClose }) => {
    if (!apiPartner) return null;

    const DocumentItem = ({ docPath, docName }) => {
        const [previewDoc, setPreviewDoc] = useState(null);

        if (!docPath) return null;

        const getDocumentIcon = () => {
            if (docPath.includes(".pdf")) return <FileText className="w-5 h-5 text-red-500" />;
            if (/\.(jpg|jpeg|png)$/i.test(docPath)) return <ImageIcon className="w-5 h-5 text-blue-500" />;
            return <FileText className="w-5 h-5 text-gray-500" />;
        };

        const handleDownload = async () => {
            try {
                const cleanPath = docPath
                    ?.replace(/\\\\/g, "/")
                    ?.replace(/\\/g, "/")
                    ?.replace(/^\/+/, "");
                const response = await fileApi.downloadFile(cleanPath);
                const blob = response.data;
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = cleanPath?.split("/").pop() || "download";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                const errorInfo = handleApiError(error, "Download failed");
                toast.error(errorInfo.message);
            }
        };

        return (
            <>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        {getDocumentIcon()}
                        <span className="text-sm font-medium">{docName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPreviewDoc({ path: docPath, name: docName })}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Preview
                        </button>
                        <button
                            onClick={handleDownload}
                            className="text-green-600 hover:text-green-800 text-sm"
                        >
                            Download
                        </button>
                    </div>
                </div>

                {previewDoc && (
                    <DocumentPreview
                        documentPath={previewDoc.path}
                        documentName={previewDoc.name}
                        onClose={() => setPreviewDoc(null)}
                    />
                )}
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full overflow-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">API Partner Details</h2>
                        <p className="text-gray-600">{apiPartner?.legalName || "N/A"}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-3">Basic Information</h3>
                            <div className="space-y-2 text-sm">
                                <div><strong>Legal Name:</strong> {apiPartner.legalName || "N/A"}</div>
                                <div><strong>Business Type:</strong> {apiPartner.businessType || "N/A"}</div>
                                <div><strong>GST Number:</strong> {apiPartner.gstNumber || "N/A"}</div>
                                <div><strong>PAN Number:</strong> {apiPartner.panNumber || "N/A"}</div>
                                <div><strong>Registration Number:</strong> {apiPartner.registrationNumber || "N/A"}</div>
                                <div><strong>Business Address:</strong> {apiPartner.businessAddress || "N/A"}</div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Contact Information</h3>
                            <div className="space-y-2 text-sm">
                                <div><strong>Primary Contact Name:</strong> {apiPartner.primaryContactName || "N/A"}</div>
                                <div><strong>Mobile:</strong> {apiPartner.primaryContactMobile || "N/A"}</div>
                                <div><strong>Email:</strong> {apiPartner.primaryContactEmail || "N/A"}</div>
                                <div><strong>Alternate Mobile:</strong> {apiPartner.alternateContactMobile || "N/A"}</div>
                                <div><strong>Landline:</strong> {apiPartner.landlineNumber || "N/A"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Information */}
                    <div>
                        <h3 className="font-semibold mb-3">Bank Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Bank Name:</strong> {apiPartner.bankName || "N/A"}</div>
                            <div><strong>Account Holder:</strong> {apiPartner.accountHolderName || "N/A"}</div>
                            <div><strong>Account Number:</strong> {apiPartner.accountNumber || "N/A"}</div>
                            <div><strong>IFSC Code:</strong> {apiPartner.ifscCode || "N/A"}</div>
                            <div><strong>Branch:</strong> {apiPartner.branchName || "N/A"}</div>
                            <div><strong>Account Type:</strong> {apiPartner.accountType || "N/A"}</div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div>
                        <h3 className="font-semibold mb-3">Documents</h3>
                        <div className="space-y-3">
                            <DocumentItem docPath={apiPartner.panCardDocument} docName="PAN Card" />
                            <DocumentItem docPath={apiPartner.gstCertificate} docName="GST Certificate" />
                            <DocumentItem docPath={apiPartner.addressProof} docName="Address Proof" />
                            <DocumentItem docPath={apiPartner.bankProof} docName="Bank Proof" />
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t text-center">
                        <div>
                            <Wallet className="w-8 h-8 mx-auto text-green-600 mb-2" />
                            <div className="text-sm text-gray-600">Wallet Balance</div>
                            <div className="font-semibold">₹{(apiPartner.walletBalance || 0).toLocaleString()}</div>
                        </div>
                        
                        <div>
                            <Calendar className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                            <div className="text-sm text-gray-600">Created On</div>
                            <div className="font-semibold">
                                {apiPartner.createdAt
                                    ? new Date(apiPartner.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerView;
