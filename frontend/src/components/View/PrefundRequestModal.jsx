import { X, Clock, Calendar, CreditCard, User, FileText } from "lucide-react";
import { usePrefundQueries } from "../Hooks/usePrefundQueries";

const PrefundRequestModal = ({ isOpen, onClose, request, isAdmin }) => {
    const { useApproveRejectPrefund } = usePrefundQueries();
    const approveRejectMutation = useApproveRejectPrefund();

    if (!isOpen || !request) return null;

    const handleAction = (action) => {
        approveRejectMutation.mutate({
            id: request.id,
            data: { action, remarks: "Processed by admin" },
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[85vh] overflow-y-auto relative">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Prefund Request #{request.id}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Section 1: Basic Info */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <InfoItem label="Requested By" value={request.requestedBy} />
                            <InfoItem label="Mobile Number" value={request.mobileNumber} />
                            <InfoItem label="Status" value={request.status} />
                            <InfoItem label="Deposit Type" value={request.depositType} />
                            <InfoItem
                                label="Deposit Amount"
                                value={`₹${request.depositAmount?.toLocaleString()}`}
                            />
                            <InfoItem label="Payment Mode" value={request.paymentMode} />
                            <InfoItem
                                label="Deposit Date"
                                value={formatDate(request.depositDate)}
                            />
                            <InfoItem
                                label="Created On"
                                value={formatDateTime(request.createDateTime)}
                            />
                        </div>
                    </section>

                    {/* Section 2: Bank Details */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-green-600" />
                            Bank Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <InfoItem label="Bank Holder Name" value={request.bankHolderName} />
                            <InfoItem label="Bank Account Name" value={request.bankAccountName} />
                            <InfoItem label="Account Number" value={request.bankAccountNumber} />
                            <InfoItem label="Transaction ID" value={request.bankTranId} />
                            <InfoItem label="IP Address" value={request.ipAddress} />
                            <InfoItem label="Narration" value={request.narration} />
                        </div>
                    </section>

                    {/* Section 3: Approval Details */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            Approval Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <InfoItem
                                label="Approval Date"
                                value={request.approveOrRejectDate || "—"}
                            />
                            <InfoItem
                                label="Approval Time"
                                value={request.approveOrRejectTime || "—"}
                            />
                            <InfoItem label="Remarks" value={request.remarks || "—"} />
                        </div>
                    </section>

                    {/* Section 4: Deposit Slip */}
                    <section>
                        <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-600" />
                            Deposit Slip
                        </h3>
                        <div className="w-full h-48 border border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm bg-gray-50 rounded-md">
                            Deposit slip preview – yet to implement
                        </div>
                    </section>
                </div>

                {/* Footer */}
                {isAdmin && request.status === "Pending" && (
                    <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                        <button
                            onClick={() => handleAction("Rejected")}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => handleAction("Approved")}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Approve
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrefundRequestModal;

// 🧩 Reusable small subcomponent
const InfoItem = ({ label, value }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <p className="text-xs text-gray-500 uppercase font-medium mb-1">{label}</p>
        <p className="text-sm text-gray-800 break-all">{value || "—"}</p>
    </div>
);

// 🕒 Formatting helpers
const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatDateTime = (dtStr) => {
    if (!dtStr) return "—";
    return new Date(dtStr).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
