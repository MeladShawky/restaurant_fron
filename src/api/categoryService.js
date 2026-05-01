import api from './axios'

const CategoryService = {
  /** GET /categories/all */
  getAllCategories: async () => {
    const response = await api.get('/categories/all')
    return response.data
  },

  /** GET /categories/category/{name}/category */
  getCategoryByName: async (name) => {
    const response = await api.get(`/categories/category/${name}/category`)
    return response.data
  },

  /** POST /categories/add */
  addCategory: async (categoryData) => {
    const response = await api.post('/categories/add', categoryData)
    return response.data
  },

  /** DELETE /categories/category/{id}/delete */
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/category/${id}/delete`)
    return response.data
  },
}

export default CategoryService
