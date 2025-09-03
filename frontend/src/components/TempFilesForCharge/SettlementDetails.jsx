import React from 'react';

const settlementCycles = [
    { key: "T0", label: "T+0 (Same Day)" },
    { key: "T1", label: "T+1 (Next Day)" },
    { key: "T2", label: "T+2 (Two Days)" }
];

const SettlementDetails = ({ selectedEntity, selectedProduct, customerType, cycle }) => {
    if (!selectedEntity || !selectedProduct) return null;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Settlement Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                    <span className="text-gray-500">
                        {customerType === "franchise" ? "Franchise:" : "Business:"}
                    </span>
                    <p className="font-medium">
                        {customerType === "franchise" ? selectedEntity.franchiseName : selectedEntity.businessName}
                    </p>
                </div>
                <div>
                    <span className="text-gray-500">Contact Person:</span>
                    <p className="font-medium">{selectedEntity.contactPersonName}</p>
                </div>
                <div>
                    <span className="text-gray-500">Product:</span>
                    <p className="font-medium">{selectedProduct.productName}</p>
                </div>
                <div>
                    <span className="text-gray-500">Settlement Cycle:</span>
                    <p className="font-medium">{settlementCycles.find(c => c.key === cycle)?.label}</p>
                </div>
            </div>
        </div>
    );
};

export default SettlementDetails;