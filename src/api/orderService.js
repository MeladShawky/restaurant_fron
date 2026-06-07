import api from './axios'

const OrderService = {
  /** POST /orders/order?userId={userId}&promoCode={promoCode} — place a new order */
  placeOrder: async (userId, promoCode) => {
    const params = { userId }
    if (promoCode) {
      params.promoCode = promoCode
    }
    const response = await api.post('/orders/order', null, {
      params,
    })
    return response.data
  },

  /** GET /orders/{orderId}/order — get single order by ID */
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/order`)
    return response.data
  },

  /** GET /orders/{userId}/orders — get all orders for a user */
  getUserOrders: async (userId) => {
    const response = await api.get(`/orders/${userId}/orders`)
    return response.data
  },
}

export default OrderService
