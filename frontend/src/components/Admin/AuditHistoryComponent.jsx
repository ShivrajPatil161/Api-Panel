import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Clock, User, FileText } from 'lucide-react';
import api from '../../constants/API/axiosInstance';

const AuditHistoryComponent = () => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [limit, setLimit] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [filterMode, setFilterMode] = useState('recent');

    useEffect(() => {
        fetchRecentHistory();
    }, []);

    const fetchRecentHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/history/recent?limit=${limit}`);
            setHistoryData(response.data);
            setTotalElements(response.data.length);
            setFilterMode('recent');
        } catch (error) {
            console.error('Error fetching recent history:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistoryByDateRange = async () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        setLoading(true);
        try {
            const formattedStartDate = `${startDate}T00:00:00`;
            const formattedEndDate = `${endDate}T23:59:59`;
            const response = await api.get(`/history?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
            setHistoryData(response.data.content);
            setTotalElements(response.data.totalElements);
            setFilterMode('dateRange');
        } catch (error) {
            console.error('Error fetching history by date range:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getChangeType = (oldValue, newValue) => {
        if (oldValue === null || oldValue === 'null') return 'added';
        if (newValue === null || newValue === 'null') return 'deleted';
        return 'modified';
    };

    const getChangeTypeBadge = (type) => {
        const styles = {
            added: 'bg-green-100 text-green-800 border-green-300',
            deleted: 'bg-red-100 text-red-800 border-red-300',
            modified: 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return styles[type] || styles.modified;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Audit History</h1>
                            <p className="text-sm text-gray-500 mt-1">Track all system changes and modifications</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span className="font-medium">{totalElements}</span> records
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Limit (Recent)</label>
                                <input
                                    type="number"
                                    value={limit}
                                    onChange={(e) => setLimit(e.target.value)}
                                    min="1"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchHistoryByDateRange}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                            >
                                <Calendar className="w-4 h-4" />
                                Filter by Date
                            </button>
                            <button
                                onClick={fetchRecentHistory}
                                disabled={loading}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                            >
                                <Clock className="w-4 h-4" />
                                Recent
                            </button>
                        </div>
                    </div>

                    {filterMode === 'dateRange' && startDate && endDate && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-md">
                            <Filter className="w-4 h-4" />
                            Showing records from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading history...</p>
                    </div>
                ) : historyData.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No history records found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {historyData.map((record) => {
                            const changeType = getChangeType(record.oldValue, record.newValue);
                            return (
                                <div
                                    key={record.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold text-sm">#{record.id}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-gray-900">{record.entityName}</h3>
                                                    <span className="text-xs text-gray-500">ID: {record.entityId}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${getChangeTypeBadge(changeType)}`}>
                                                        {changeType}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">Field: <span className="font-medium">{record.fieldName}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <User className="w-4 h-4" />
                                                <span>{record.changedBy}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>{formatDateTime(record.changedAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Old Value</p>
                                            <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
                                                <p className="text-sm text-gray-800 break-all">
                                                    {record.oldValue === null || record.oldValue === 'null' ? (
                                                        <span className="text-gray-400 italic">null</span>
                                                    ) : (
                                                        record.oldValue
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">New Value</p>
                                            <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                                                <p className="text-sm text-gray-800 break-all">
                                                    {record.newValue === null || record.newValue === 'null' ? (
                                                        <span className="text-gray-400 italic">null</span>
                                                    ) : (
                                                        record.newValue
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {record.parentEntityName && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                Parent: <span className="font-medium">{record.parentEntityName}</span>
                                                {record.parentEntityId && ` (ID: ${record.parentEntityId})`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditHistoryComponent;