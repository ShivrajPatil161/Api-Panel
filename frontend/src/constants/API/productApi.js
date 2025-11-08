import api from './axiosInstance';
import { toast } from 'react-toastify';

const endpoint = '/products';

/**
 * Fetch products with pagination, sorting, and search
 * Compatible with TanStack Query's queryFn signature
 */
export const getProducts = async ({ queryKey }) => {
  const [_key, { page = 0, size = 10, sortBy = 'productName', sortDir = 'asc', search = '' }] = queryKey;

  try {
    let url = `${endpoint}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    
    if (search.trim()) {
      url = `${endpoint}/search?q=${encodeURIComponent(search)}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    }

    const res = await api.get(url);
    return res.data;
  } catch (err) {
    // Only show toast for unexpected errors, not for empty results
    if (err.response?.status !== 404) {
      toast.error(err.response?.data?.message || 'Failed to fetch products');
    }
    throw err;
  }
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (id) => {
  try {
    const res = await api.get(`${endpoint}/${id}`);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to fetch product details');
    throw err;
  }
};

/**
 * Create a new product
 */
export const createProduct = async (productData) => {
  try {
    const res = await api.post(endpoint, productData);
    toast.success('Product created successfully!');
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to create product';
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (id, productData) => {
  try {
    const res = await api.patch(`${endpoint}/${id}`, productData);
    toast.success('Product updated successfully!');
    return res.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to update product';
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id) => {
  try {
    await api.delete(`${endpoint}/${id}`);
    toast.success('Product deleted successfully!');
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to delete product';
    toast.error(errorMessage);
    throw err;
  }
};

