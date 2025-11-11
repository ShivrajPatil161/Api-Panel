import api from './axiosInstance'

export const partnerSchemeApi = {
  getPartners: () => api.get('/partners').then(res => res.data),
  
  getProducts: () => api.get('/products').then(res => res.data?.content),
  
  getValidSchemes: (productId, categoryName) => 
    api.get('/pricing-schemes/valid-pricing-scheme', {
      params: { productId, productCategory: categoryName, customerType: 'api_partner' }
    }).then(res => res.data),
  
  createAssignment: (data) => api.post('/partner-schemes', data),
  
  updateAssignment: (id, data) => api.put(`/partner-schemes/${id}`, data)
}