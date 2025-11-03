import api from "./axiosInstance";


export const getAdminBanks = async ({queryKey}) => {
    const [_key, { page, size, sortBy, sortOrder }] = queryKey
    const response = await api.get("/admin-banks", {
        params: { page, size, sortBy, sortOrder }
    })
    if (!response.data.success) {
        throw new Error(response.data.message || 'Falied to fetch banks')
    }
    return response.data.data
}


export const createAdminBank = async (bankData) => {
    const response = await api.post("/admin-banks", bankData)
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create bank')
    }
    return response.data.data
}

export const updateAdminBank = async ({ id, data }) => {
    const response = await api.put(`/admin-banks/${id}`, data)
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update bank')
    }
    return response.data.data
}

export const deleteAdminBank = async (id) => {
    const response = await api.delete(`/admin-banks/${id}`)
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete bank')
    }
    return response.data.data
}

// Search banks by name
export const searchAdminBanks = async ({queryKey}) => {
    const [_key, { query, page, size, sortBy, sortOrder }] = queryKey
    const response = await api.get('/admin-banks/search', {
        params: { query, page, size, sortBy, sortOrder }
    })
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to search banks')
    }
    return response.data.data
}

// Advanced search with filters
export const advancedSearchAdminBanks = async ({queryKey}) => {
    const [_key, { bankName, ifscCode, charges, page, size, sortBy, sortOrder }] = queryKey
    const response = await api.get('/admin-banks/search/advanced', {
        params: { bankName, ifscCode, charges, page, size, sortBy, sortOrder }
    })
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to perform advanced search')
    }
    return response.data.data
}