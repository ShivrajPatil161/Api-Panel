import api from './axiosInstance';


// Api Partner APIs
export const apiPartnerApi = {
  // Get all merchants (including both franchise and direct merchants)
  getAll: () => api.get('/partners'),

  // Get all direct merchants only
  getAllDirect: () => api.get('/partners/api-Partners'),

  // Get merchant by ID
  getById: (id) => api.get(`/partners/${id}`),

  // Create merchant
  create: (data) => api.post('/partners', data),

  // Update merchant
  update: (id, data) => api.put(`/partners/${id}`, data),

  // Delete merchant
  delete: (id) => api.delete(`/partners/${id}`),
};

// File/Document APIs
export const fileApi = {
  // Get file by path
  getFile: (filePath) => api.get(`/file/files/${filePath}`, {
    responseType: 'blob'
  }),

  // Download file
  downloadFile: (filePath) => api.get(`/file/files/${filePath}`, {
    responseType: 'blob'
  }),

  // Upload file
  uploadFile: (formData) => api.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
};

// Customer APIs (Generic functions that work for both franchise and merchant)
export const customerApi = {
  // Get customer details (automatically determines type)
  getCustomerDetails: async (id, type) => {
    // Handle franchiseMerchant type as merchant for API call
    const apiType = type === 'api-Partner';
    const endpoint = apiType ===`${id}`;
    return api.get(endpoint);
  },

  // Delete customer (automatically determines type)
  deleteCustomer: async (id, type) => {
    // Handle franchiseMerchant type as merchant for API call
    const apiType = type === 'api-Partner';
    const endpoint = apiType ===`${id}`;
    return api.delete(endpoint);
  },

  // Update customer (automatically determines type)
  updateCustomer: async (id, type, data) => {
    // Handle franchiseMerchant type as merchant for API call
    const apiType = type === 'api-Partner';
    const endpoint = apiType ===`${id}`;
    return api.put(endpoint, data);
  },
};

// // Search and filter APIs (if you need them in the future)
// export const searchApi = {
//   // Search franchises
//   searchFranchises: (searchTerm) => api.get(`/franchise/search?q=${searchTerm}`),

//   // Search merchants
//   searchMerchants: (searchTerm) => api.get(`/merchants/search?q=${searchTerm}`),

//   // Filter customers by status
//   getCustomersByStatus: (type, status) => {
//     const endpoint = type === 'franchise' ? '/franchise' : '/merchants/direct-merchant';
//     return api.get(`${endpoint}?status=${status}`);
//   },
// };

// // Dashboard/Analytics APIs (for future use)
// export const analyticsApi = {
//   // Get customer statistics
//   getCustomerStats: () => api.get('/analytics/customers'),

//   // Get revenue data
//   getRevenueStats: () => api.get('/analytics/revenue'),

//   // Get growth metrics
//   getGrowthMetrics: () => api.get('/analytics/growth'),
// };

// Utility functions for error handling
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText || defaultMessage;
    return {
      message,
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      data: null
    };
  } else {
    // Something happened in setting up the request
    return {
      message: error.message || defaultMessage,
      status: 0,
      data: null
    };
  }
};

// // Batch operations (for future use)
// export const batchApi = {
//   // Delete multiple customers
//   deleteMultiple: (ids, type) => {
//     const endpoint = type === 'franchise' ? '/franchise/batch-delete' : '/merchants/batch-delete';
//     return api.delete(endpoint, { data: { ids } });
//   },

//   // Update multiple customers
//   updateMultiple: (updates, type) => {
//     const endpoint = type === 'franchise' ? '/franchise/batch-update' : '/merchants/batch-update';
//     return api.put(endpoint, updates);
//   },

//   // Export customers
//   exportCustomers: (type, format = 'csv') => {
//     const endpoint = type === 'franchise' ? '/franchise/export' : '/merchants/export';
//     return api.get(`${endpoint}?format=${format}`, {
//       responseType: 'blob'
//     });
//   },
// };