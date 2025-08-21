// frontend/src/services/inwardAPI.js
import api from './axiosInstance'

// Inward Transaction APIs
export const inwardAPI = {
  // Get all inward transactions
  getAllInwardTransactions: async () => {
    try {
      const response = await api.get('/inward-transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching inward transactions:', error);
      throw error;
    }
  },

  // Get single inward transaction by ID
  getInwardTransactionById: async (id) => {
    try {
      const response = await api.get(`/inward-transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inward transaction:', error);
      throw error;
    }
  },

  // Create new inward transaction
  createInwardTransaction: async (inwardData) => {
    try {
      // Transform frontend data to backend format
      const transformedData = transformToBackendFormat(inwardData);
      const response = await api.post('/inward-transactions', transformedData);
      return response.data;
    } catch (error) {
      console.error('Error creating inward transaction:', error);
      throw error;
    }
  },

  // Update inward transaction
  updateInwardTransaction: async (id, inwardData) => {
    try {
      const transformedData = transformToBackendFormat(inwardData);
      const response = await api.put(`/inward-transactions/${id}`, transformedData);
      return response.data;
    } catch (error) {
      console.error('Error updating inward transaction:', error);
      throw error;
    }
  },

  // Delete inward transaction
  deleteInwardTransaction: async (id) => {
    try {
      const response = await api.delete(`/inward-transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting inward transaction:', error);
      throw error;
    }
  }
};

// Transform frontend form data to backend expected format
const transformToBackendFormat = (frontendData) => {
  // Extract serial numbers from grid data
  const serialNumbers = [];
  
  if (frontendData.serialNumberGrid && frontendData.serialNumberGrid.length > 0) {
    frontendData.serialNumberGrid.forEach(gridRow => {
      // Only add serial numbers for selected fields
      const serialEntry = {};
      
      if (gridRow.selectedFields?.MID && gridRow.MID) {
        serialEntry.mid = gridRow.MID;
      }
      if (gridRow.selectedFields?.SID && gridRow.SID) {
        serialEntry.sid = gridRow.SID;
      }
      if (gridRow.selectedFields?.TID && gridRow.TID) {
        serialEntry.tid = gridRow.TID;
      }
      if (gridRow.selectedFields?.VpID && gridRow.VpID) {
        serialEntry.vpaid = gridRow.VpID;
      }

      // Only add if at least one field is selected
      if (Object.keys(serialEntry).length > 0) {
        serialNumbers.push(serialEntry);
      }
    });
  }

  // Backend expected format based on your model
  const backendData = {
    invoiceNumber: frontendData.invoiceNumber,
    vendorId: parseInt(frontendData.vendorId),
    receivedDate: frontendData.receivedDate,
    receivedBy: frontendData.receivedBy,
    productId: parseInt(frontendData.productId),
    quantity: parseInt(frontendData.quantity),
    batchNumber: frontendData.batchNumber || null,
    warrantyPeriod: frontendData.warrantyPeriod ? parseInt(frontendData.warrantyPeriod) : null,
    productCondition: frontendData.condition,
    serialNumbers: serialNumbers,
    remark: frontendData.remarks || null
  };

  return backendData;
};

// Transform backend data to frontend format for editing
export const transformToFrontendFormat = (backendData) => {
  // Create serial number grid from backend data
  const serialNumberGrid = [];
  
  if (backendData.serialNumbers && backendData.serialNumbers.length > 0) {
    backendData.serialNumbers.forEach((serial, index) => {
      serialNumberGrid.push({
        id: index + 1,
        MID: serial.mid || '',
        SID: serial.sid || '',
        TID: serial.tid || '',
        VpID: serial.vpaid || '',
        selectedFields: {
          MID: !!serial.mid,
          SID: !!serial.sid,
          TID: !!serial.tid,
          VpID: !!serial.vpaid
        }
      });
    });
  }

  return {
    id: backendData.id,
    invoiceNumber: backendData.invoiceNumber,
    vendorId: backendData.vendor?.id?.toString() || '',
    vendorName: backendData.vendor?.name || '',
    receivedDate: backendData.receivedDate,
    receivedBy: backendData.receivedBy,
    productId: backendData.product?.id?.toString() || '',
    productName: backendData.product?.name || '',
    productType: backendData.product?.type || '',
    quantity: backendData.quantity?.toString() || '',
    batchNumber: backendData.batchNumber || '',
    warrantyPeriod: backendData.warrantyPeriod?.toString() || '',
    condition: backendData.productCondition,
    remarks: backendData.remark || '',
    serialNumberGrid: serialNumberGrid,
    status: 'Received' // Default status
  };
};

export default inwardAPI;