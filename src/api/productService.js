import api from './axios'

const BASE_URL = 'http://localhost:8080/api/v1'

const ProductService = {
  /** GET /products/all */
  getAllProducts: async () => {
    const response = await api.get('/products/all')
    return response.data
  },

  /** POST /products/add */
  addProduct: async (productData) => {
    const response = await api.post('/products/add', productData)
    return response.data
  },

  /** PUT /products/product/{id}/update */
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/product/${id}/update`, productData)
    return response.data
  },

  /** DELETE /products/product/{id}/delete */
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/product/${id}/delete`)
    return response.data
  },

  /** Build image download URL from image ID */
  getImageUrl: (imageId) => {
    return `${BASE_URL}/images/image/download/${imageId}`
  },
}

export default ProductService
