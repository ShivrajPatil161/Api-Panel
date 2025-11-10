import api from './axiosInstance';
const vendorApi = {
  // Get all vendors
  async getAllVendors() {
    try {
      const response = await api.get('/vendors');
      return response.data;
    } catch (error) {
      console.error('Error', error);
      throw error; // Add this to properly propagate errors
    }
  },

  
  // Create new vendor
  async createVendor(vendorData) {
    try {
      const payload = transformVendorData(vendorData)
      const response = await api.post('/vendors', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to create vendor:', error);
      throw error; // Add this to properly propagate errors
    }
  },

  // Update existing vendor
  async updateVendor(id, vendorData) {
    try {
      const response = await api.put(`/vendors/${id}`, vendorData);
      return response.data;
    } catch (error) {
      console.error('Failed to update vendor:', error);
      throw error; // Add this to properly propagate errors
    }
  },

  // Delete vendor
  async deleteVendor(id) {
    try {
      await api.delete(`/vendors/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete vendor:', error);
     throw error; // Add this to properly propagate errors
    }
  },

  // Get vendor by ID
  async getVendorById(id) {
    try {
      const response = await api.get(`/vendors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vendor:', error);
      throw error; // Add this to properly propagate errors
    }
  }
};

export default vendorApi;


const transformVendorData = (formData) => {
  return {
    productId: formData.productId || null,
    name: formData.name,
    bankType: formData.bankType,
    status: formData.status ?? true,

    contactPersonName: formData.contactPersonName || formData.contactPerson?.name || '',
    contactNumber: formData.contactNumber || formData.contactPerson?.phoneNumber || '',
    contactEmail: formData.contactEmail || formData.contactPerson?.email || '',

    address: formData.address,
    city: formData.city,
    state: formData.state,
    pinCode: formData.pinCode,

    gstNumber: formData.gstNumber,
    pan: formData.pan,

    agreementStartDate: formData.agreementStartDate,
    agreementEndDate: formData.agreementEndDate,
    creditPeriodDays: formData.creditPeriodDays,
    paymentTerms: formData.paymentTerms,

    remark: formData.remarks || formData.remark || ''
  };
};
