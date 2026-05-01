import api from './axios'

const CartService = {
  /** GET /carts/{cartId}/my-cart */
  getCart: async (cartId) => {
    const response = await api.get(`/carts/${cartId}/my-cart`)
    return response.data
  },

  /** GET /carts/user/{userId}/my-cart — get cart by user ID */
  getCartByUserId: async (userId) => {
    const response = await api.get(`/carts/user/${userId}/my-cart`)
    return response.data
  },

  /** POST /cart-items/item/add?productId=&quantity= */
  addItemToCart: async (cartId, productId, quantity = 1) => {
    const response = await api.post('/cart-items/item/add', null, {
      params: { productId, quantity },
    })
    return response.data
  },

  /** PUT /cart-items/cart/{cartId}/item/{productId}/update */
  updateItemQuantity: async (cartId, productId, quantity) => {
    const response = await api.put(
      `/cart-items/cart/${cartId}/item/${productId}/update`,
      null,
      { params: { quantity } }
    )
    return response.data
  },

  /** DELETE /cart-items/cart/{cartId}/item/{itemId}/remove */
  removeItem: async (cartId, itemId) => {
    const response = await api.delete(
      `/cart-items/cart/${cartId}/item/${itemId}/remove`
    )
    return response.data
  },
}

export default CartService
