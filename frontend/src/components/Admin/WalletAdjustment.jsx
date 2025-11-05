

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../constants/API/axiosInstance';
import PageHeader from '../UI/PageHeader';
import { Wallet } from 'lucide-react';

const WalletAdjustment = () => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState('');
    const [walletInfo, setWalletInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: 'CREDIT',
        amount: '',
        remark: ''
    });

    // Fetch partners
    const fetchPartners = async () => {
        try {
            const res = await api.get('/partners');
            setPartners(res.data);
        } catch (err) {
            console.error('Error fetching partners:', err);
            toast.error(err.response?.data?.message || 'Failed to fetch partners');
        }
    };

    // Fetch wallet balance for a specific partner
    const fetchWalletBalance = async (partnerId) => {
        try {
            const res = await api.get(`/wallet-adjustment/apiPartner/${partnerId}`);
            return res.data.availableBalance;
        } catch (err) {
            console.error('Error fetching wallet balance:', err);
            toast.error(err.response?.data?.message || 'Failed to fetch wallet balance');
            return null;
        }
    };

    // Fetch wallet info when a partner is selected
    const fetchWallet = async () => {
        try {
            const partner = partners.find(p => p.id === parseInt(selectedPartner));
            if (partner) {
                const balance = await fetchWalletBalance(partner.id);
                setWalletInfo({
                    id: partner.id,
                    name: partner.partnerName || partner.businessName,
                    balance
                });
            }
        } catch (err) {
            console.error('Error fetching wallet:', err);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    useEffect(() => {
        if (selectedPartner) {
            fetchWallet();
        } else {
            setWalletInfo(null);
        }
    }, [selectedPartner]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                apiPartnerId: walletInfo.id,
                actionOnBalance: formData.type,
                amount: parseFloat(formData.amount),
                remark: formData.remark
            };

            await api.post('/wallet-adjustment/apiPartner', payload);

            toast.success('Wallet adjustment successful');
            setFormData({ type: 'CREDIT', amount: '', remark: '' });

            const updatedBalance = await fetchWalletBalance(walletInfo.id);
            if (updatedBalance !== null) {
                setWalletInfo(prev => ({ ...prev, balance: updatedBalance }));
            }

            fetchPartners();
        } catch (err) {
            console.error('Error adjusting wallet:', err);
            toast.error(err.response?.data?.message || 'Failed to adjust wallet');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ type: 'CREDIT', amount: '', remark: '' });
    };

    return (
        <div className="max-w-9xl mx-auto p-3">
            <div className="mb-8">
                <PageHeader
                    icon={Wallet}
                    iconColor="text-indigo-600"
                    title="Wallet Adjustment"
                    description="Manage and adjust Partner wallet balances"
                />

            </div>

            <div className="    ">
                {/* Partner Selection */}
                <div className="p-6 rounded-xl shadow-sm mb-8 ">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Partner</h2>

                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Partner <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedPartner}
                                onChange={(e) => setSelectedPartner(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Choose partner...</option>
                                {partners.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.partnerName || p.businessName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {walletInfo && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Partner Name
                                </p>
                                <p className="text-xl font-bold text-gray-800">{walletInfo.name}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                    Available Balance
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                    ₹{walletInfo.balance?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>


                {/* Wallet Info + Form */}
                {walletInfo && (
                    <div className="animate-fadeIn">
                       

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Adjustment Details</h3>

                            {/* Type buttons */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transaction Type <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {['CREDIT', 'DEBIT'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type })}
                                            className={`w-20 py-1.5 rounded-md text-sm font-medium transition-all ${formData.type === type
                                                ? (type === 'CREDIT'
                                                    ? 'bg-green-600 text-white shadow'
                                                    : 'bg-red-600 text-white shadow')
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {type.charAt(0) + type.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount & Remark */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remark <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.remark}
                                        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter reason for adjustment..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Reset Form
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors shadow-md"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : 'Submit Adjustment'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {!walletInfo && (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Select Partner</h3>
                        <p className="text-gray-500 text-sm">Choose a partner to view wallet details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletAdjustment;
