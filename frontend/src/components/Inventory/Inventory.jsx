import { useState } from 'react'
import { Plus } from 'lucide-react'
import InventoryTable from './InventoryTable' 
import InwardTable from './InwardTable' 
import OutwardTable from './OutwardTable' 
import ReturnTable from './ReturnTable' 
import { InwardFormModal } from '../Forms/Inward'
import OutwardForm from '../Forms/Outward'
import ReturnsForm from '../Forms/Return'

const InventoryManagement = () => {
    const [activeTab, setActiveTab] = useState('inventory')
    const [isInwardModalOpen, setIsInwardModalOpen] = useState(false)
    const [isOutwardModalOpen, setIsOutwardModalOpen] = useState(false)
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)

    // Sample data - replace with your actual data management
    const [inventoryData, setInventoryData] = useState([
        { id: 1, productCode: 'PROD-001', productName: 'POS Terminal X1', quantity: 25, reserved: 5, available: 20 },
        { id: 2, productCode: 'PROD-002', productName: 'QR Scanner Pro', quantity: 15, reserved: 2, available: 13 },
        { id: 3, productCode: 'PROD-003', productName: 'Card Reader Basic', quantity: 30, reserved: 8, available: 22 }
    ])

    const [inwardData, setInwardData] = useState([])
    const [outwardData, setOutwardData] = useState([])
    const [returnData, setReturnData] = useState([])

    const tabs = [
        { id: 'inventory', label: 'Inventory', count: inventoryData.length },
        { id: 'inward', label: 'Inward Entry', count: inwardData.length },
        { id: 'outward', label: 'Outward Entry', count: outwardData.length },
        { id: 'returns', label: 'Returns', count: returnData.length }
    ]

    const handleInwardSubmit = (data) => {
        setInwardData(prev => [...prev, { ...data, id: Date.now() }])
        setIsInwardModalOpen(false)
    }

    const handleOutwardSubmit = (data) => {
        setOutwardData(prev => [...prev, { ...data, id: Date.now() }])
        setIsOutwardModalOpen(false)
    }

    const handleReturnSubmit = (data) => {
        setReturnData(prev => [...prev, { ...data, id: Date.now() }])
        setIsReturnModalOpen(false)
    }

    const getActionButtons = () => {
        switch (activeTab) {
            case 'inward':
                return (
                    <button
                        onClick={() => setIsInwardModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Inward Entry</span>
                    </button>
                )
            case 'outward':
                return (
                    <button
                        onClick={() => setIsOutwardModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Outward Entry</span>
                    </button>
                )
            case 'returns':
                return (
                    <button
                        onClick={() => setIsReturnModalOpen(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Return Entry</span>
                    </button>
                )
            default:
                return null
        }
    }

    const renderActiveTable = () => {
        switch (activeTab) {
            case 'inventory':
                return <InventoryTable data={inventoryData} />
            case 'inward':
                return <InwardTable data={inwardData} />
            case 'outward':
                return <OutwardTable data={outwardData} />
            case 'returns':
                return <ReturnTable data={returnData} />
            default:
                return <InventoryTable data={inventoryData} />
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow-sm rounded-lg mb-6">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                                <p className="text-gray-600 mt-1">Manage your inventory, inward, outward and returns</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {getActionButtons()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white shadow-sm rounded-lg mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === tab.id
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Table Content */}
                <div className="bg-white shadow-sm rounded-lg">
                    {renderActiveTable()}
                </div>

                {/* Modals */}
                <InwardFormModal
                    isOpen={isInwardModalOpen}
                    onClose={() => setIsInwardModalOpen(false)}
                    onSubmit={handleInwardSubmit}
                />

                {isOutwardModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                            <OutwardForm
                                onSubmit={handleOutwardSubmit}
                                onCancel={() => setIsOutwardModalOpen(false)}
                            />
                        </div>
                    </div>
                )}

                {isReturnModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                            <ReturnsForm
                                onSubmit={handleReturnSubmit}
                                onCancel={() => setIsReturnModalOpen(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InventoryManagement