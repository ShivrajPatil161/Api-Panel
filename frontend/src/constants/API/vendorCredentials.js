import api from "./axiosInstance";

export const getVendorCredentials = async ({queryKey}) => {
    const [_key, { page, size, sortBy, sortOrder }] = queryKey
    const response = await api.get("/vendor-credential", {
        params: { page, size, sortBy, sortOrder }
    })
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch vendor credentials')
    }
    return response.data.data
}

export const createVendorCredential = async (credentialData) => {
const payload = {
    ...credentialData,
    vendorInfo: { id: Number(credentialData.vendor) },
    productId: Number(credentialData.product),
    //isActive: credentialData.isActive ?? true,
  }

  delete payload.vendor
  delete payload.product


    const response = await api.post("/vendor-credential", payload)
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create vendor credential')
    }
    return response.data.data
}

export const updateVendorCredential = async ({ id, data }) => {
    const response = await api.put(`/vendor-credential/${id}`, data)
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update vendor credential')
    }
    return response.data.data
}

export const deleteVendorCredential = async (id) => {
    const response = await api.delete(`/vendor-credential/${id}`)
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete vendor credential')
    }
    return response.data.data
}