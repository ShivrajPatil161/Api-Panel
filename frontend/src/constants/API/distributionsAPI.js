import { toast } from "react-toastify";
import api from "./axiosInstance";

// Distribution API Service
const distributionApi = {
  // Get all franchises
  getAllFranchises: async () => {
    try {
      const response = await api.get('/franchise');
      return response.data;
    } catch (error) {
      console.error('Error fetching franchises:', error);
      throw new Error('Failed to load franchises');
    }
  },

  // Get all products dispatched to franchise
  getFranchiseProducts: async (franchiseId) => {
    try {
      const response = await api.get(`/franchise/products/${franchiseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching franchise products:', error);
      throw new Error('Failed to load products');
    }
  },

  // Get serial numbers to dispatch for a product
  getSerialNumbersToDispatch: async (outwardId) => {
    try {
      const response = await api.get(`/franchise/serial-num-to-dispatch/${outwardId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching serial numbers:', error);
      throw new Error('Failed to load devices');
    }
  },

  // Get merchants by franchise
  getMerchantsByFranchise: async (franchiseId) => {
    try {
      const response = await api.get(`/merchants/franchise/${franchiseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching merchants:', error);
      throw new Error('Failed to load merchants');
    }
  },

  // Submit distribution (to be implemented)
  submitDistribution: async (distributionData) => {
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await api.post("/product-serial-number/assign-merchant", distributionData);
      if (response.status === 200) {
        toast.success(response.data);
      }
      console.log('Distribution Data:', {
        merchantId: distributionData.merchantId,
        selectedDeviceIds: distributionData.selectedDeviceIds,
        quantity: distributionData.quantity
      });
      
      return { success: true, message: 'Distribution completed successfully' };
    } catch (error) {
      console.error('Error submitting distribution:', error);
      throw new Error('Distribution failed');
    }
  }
};

export default distributionApi;