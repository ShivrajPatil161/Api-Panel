// frontend/src/components/Reports/SchemeAssignmentTimeline.jsx
import React from 'react';
import { Calendar, Users, Building, ArrowRight } from 'lucide-react';

const SchemeAssignmentTimeline = ({ assignments }) => {
  // Sort assignments by effective date
  const sortedAssignments = [...assignments].sort((a, b) => 
    new Date(a.effectiveDate) - new Date(b.effectiveDate)
  );

  const getStatusColor = (assignment) => {
    const now = new Date();
    const effectiveDate = new Date(assignment.effectiveDate);
    const expiryDate = assignment.expiryDate ? new Date(assignment.expiryDate) : null;

    if (effectiveDate > now) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (expiryDate && expiryDate < now) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusText = (assignment) => {
    const now = new Date();
    const effectiveDate = new Date(assignment.effectiveDate);
    const expiryDate = assignment.expiryDate ? new Date(assignment.expiryDate) : null;

    if (effectiveDate > now) return 'Upcoming';
    if (expiryDate && expiryDate < now) return 'Expired';
    return 'Active';
  };

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No assignment history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedAssignments.map((assignment, index) => {
        const Icon = assignment.customerType === 'FRANCHISE' ? Building : Users;
        const statusColor = getStatusColor(assignment);
        const statusText = getStatusText(assignment);

        return (
          <div key={assignment.id} className="relative">
            {/* Timeline line */}
            {index < sortedAssignments.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            <div className="flex items-start gap-4">
              {/* Timeline dot */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${statusColor} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.customerType === 'FRANCHISE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {assignment.customerType}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      Customer ID: {assignment.customerId}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(assignment.effectiveDate).toLocaleDateString()}</span>
                    </div>
                    {assignment.expiryDate && (
                      <>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(assignment.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Scheme ID: </span>
                    <span className="font-mono text-gray-600">{assignment.schemeId}</span>
                  </div>

                  {assignment.remarks && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Remarks: </span>
                      <span className="text-sm text-gray-600">{assignment.remarks}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SchemeAssignmentTimeline;