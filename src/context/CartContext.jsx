import React, { createContext, useContext, useState, useEffect } from 'react'
import CartService from '../api/cartService'
import { toast } from 'react-toastify'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Safely parse JSON from localStorage
const safeParseJSON = (str) => {
  try {
    if (!str || str === 'undefined' || str === 'null') return null
    return JSON.parse(str)
  } catch {
    return null
  }
}

// Decode JWT token payload to get user ID
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [cartId, setCartId] = useState(null)

  // Get user ID from localStorage or JWT token
  const getUserId = () => {
    const user = safeParseJSON(localStorage.getItem('user'))
    if (user?.id) return user.id

    // Fallback: decode from JWT token
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined') {
      const decoded = decodeToken(token)
      return decoded?.id || null
    }
    return null
  }

  // Fetch cart data — tries by userId first, then by cartId
  // Returns the cartId so callers can use it immediately (avoids stale state)
  const fetchCart = async () => {
    const userId = getUserId()
    if (!userId) {
      console.warn('No userId found, cannot fetch cart')
      return null
    }

    setLoading(true)
    try {
      // Try fetching cart by user ID
      // CartService returns response.data which is ApiResponse { message, data }
      const apiResponse = await CartService.getCartByUserId(userId)
      console.log('Cart API response:', apiResponse)

      // Unwrap ApiResponse — the actual cart is inside .data
      const cartData = apiResponse?.data || apiResponse
      console.log('Cart data (unwrapped):', cartData)

      const fetchedCartId = cartData.cartId || cartData.id
      setCart(cartData)
      setCartId(fetchedCartId)
      setCartItems(cartData.items || [])
      setTotalAmount(cartData.totalAmount || 0)
      setItemCount(cartData.items?.length || 0)
      return fetchedCartId
    } catch (error) {
      console.error('Error fetching cart by userId:', error)
      // Cart might not exist yet — that's OK
      return null
    } finally {
      setLoading(false)
    }
  }

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem('token')
    if (!token || token === 'undefined') {
      toast.warning('Please login to add items to cart')
      return
    }

    // Use existing cartId, or fetch it fresh and use the returned value
    let id = cartId
    if (!id) {
      id = await fetchCart()
    }

    if (!id) {
      toast.warning('Unable to find your cart. Please try again.')
      console.error('CartId is still null after fetch. UserId:', getUserId())
      return
    }

    try {
      await CartService.addItemToCart(id, productId, quantity)
      toast.success('Added to cart!')
      await fetchCart()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item')
      console.error('Error adding to cart:', error)
    }
  }

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (!cartId) return

    try {
      await CartService.updateItemQuantity(cartId, itemId, quantity)
      await fetchCart()
    } catch (error) {
      toast.error('Failed to update quantity')
      console.error('Error updating quantity:', error)
    }
  }

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!cartId) return

    try {
      await CartService.removeItem(cartId, itemId)
      toast.success('Item removed from cart')
      await fetchCart()
    } catch (error) {
      toast.error('Failed to remove item')
      console.error('Error removing item:', error)
    }
  }

  // Clear cart (local state only)
  const clearCart = () => {
    setCart(null)
    setCartItems([])
    setTotalAmount(0)
    setItemCount(0)
  }

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined') {
      fetchCart()
    }
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        totalAmount,
        itemCount,
        loading,
        cartId,
        getUserId,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
