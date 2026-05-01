import api from './axios'

const BASE_URL = 'http://localhost:8080/api/v1'

const ImageService = {
  /** POST /images/upload — multipart file upload */
  uploadImage: async (file, productId) => {
    const formData = new FormData()
    formData.append('files', file)
    formData.append('productId', productId)

    const response = await api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  /** GET /images/image/download/{imageId} — returns binary */
  getImageUrl: (imageId) => {
    return `${BASE_URL}/images/image/download/${imageId}`
  },
}

export default ImageService
