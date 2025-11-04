import api from "./axiosInstance";

/**
 * Partner: Create a new prefund request
 */
export const createPrefundRequest = async (data) => {
  const response = await api.post("/prefund-auth/request", data);
  return response.data.data;
};

/**
 * Admin: Get all pending requests
 */
export const getPendingRequests = async ({ queryKey }) => {
  const [_key, { page, size }] = queryKey;
  const response = await api.get("/prefund-auth/admin/pending", {
    params: { page, size },
  });
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch pending requests");
  }
  return response.data.data;
};

/**
 * Admin: Get all requests (paginated)
 */
export const getAllRequests = async ({ queryKey }) => {
  const [_key, { page, size }] = queryKey;
  const response = await api.get("/prefund-auth/admin/all", {
    params: { page, size },
  });
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch all requests");
  }
  return response.data.data;
};

/**
 * Admin: Approve or reject request
 */
export const approveOrRejectRequest = async ({ id, data }) => {
  const response = await api.put(`/prefund-auth/admin/action/${id}`, data);
  return response.data.data;
};

/**
 * User: Get their own requests (paginated)
 */
export const getMyRequests = async ({ queryKey }) => {
  const [_key, { page, size }] = queryKey;
  const response = await api.get("/prefund-auth/my-requests", {
    params: { page, size },
  });
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch user requests");
  }
  return response.data.data;
};
