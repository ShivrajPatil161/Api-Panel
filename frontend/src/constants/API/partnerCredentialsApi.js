import api from './axiosInstance';

const BASE_URL = '/partner-credentials';

export const partnerCredentialsApi = {
  // Get all partner credentials
  getAll: async () => {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  // Get partner credential by ID
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create new partner credential
  create: async (data) => {
    const payload = {
      apiPartnerId: parseInt(data.partner),
      productId: parseInt(data.product),
      tokenUrlUat: data.tokenUrlUat,
      tokenUrlProd: data.tokenUrlProd,
      baseUrlUat: data.baseUrlUat,
      baseUrlProd: data.baseUrlProd,
      callbackUrl: data.callbackUrl,
      isActive: data.isActive
    };
    const response = await api.post(BASE_URL, payload);
    return response.data;
  },

  // Update partner credential
  update: async (id, data) => {
    console.log(data)
    const payload = {
      apiPartnerId: parseInt(data.partner),
      productId: parseInt(data.product),
      tokenUrlUat: data.tokenUrlUat,
      tokenUrlProd: data.tokenUrlProd,
      baseUrlUat: data.baseUrlUat,
      baseUrlProd: data.baseUrlProd,
      callbackUrl: data.callbackUrl,
      isActive: data.isActive
    };
    const response = await api.put(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  // Delete partner credential
  delete: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};