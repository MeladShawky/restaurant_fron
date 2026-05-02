import React, { useState } from 'react'
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiCheck } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import OrderService from '../../api/orderService'
import ProductService from '../../api/productService'
import { toast } from 'react-toastify'
import SecureImage from '../SecureImage/SecureImage'
import './CartDrawer.css'

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart()
  const { user } = useAuth()
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const getItemImage = (item) => {
    if (item.product?.images && item.product.images.length > 0) {
      return ProductService.getImageUrl(item.product.images[0].imageId || item.product.images[0].id)
    }
    return '/images/fattoush_salad_1777635117801.png'
  }

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      toast.warning('Please login to place an order')
      return
    }
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty')
      return
    }

    setPlacingOrder(true)
    try {
      await OrderService.placeOrder(user.id)
      setOrderSuccess(true)
      clearCart()
      toast.success('Order placed successfully! 🎉')

      // Reset success state after animation
      setTimeout(() => {
        setOrderSuccess(false)
        onClose()
        fetchCart()
      }, 2500)
    } catch (error) {
      console.error('Order error:', error.response?.data || error.message)
      const status = error.response?.status
      if (status === 401) {
        toast.error('Session expired. Please log in again.')
      } else {
        // Backend ApiResponse has { message, data } — message holds the error
        const msg = error.response?.data?.message || error.response?.data || 'Failed to place order. Please try again.'
        toast.error(msg)
      }
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`} id="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">
            <FiShoppingBag /> My Cart
          </h3>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            <FiX />
          </button>
        </div>

        {/* Order Success Animation */}
        {orderSuccess ? (
          <div className="cart-drawer__success">
            <div className="cart-drawer__success-icon">
              <FiCheck />
            </div>
            <h4>Order Placed!</h4>
            <p>Your delicious food is on its way</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cart-drawer__items">
              {cartItems.length === 0 ? (
                <div className="cart-drawer__empty">
                  <FiShoppingBag className="cart-drawer__empty-icon" />
                  <p>Your cart is empty</p>
                  <span>Add some delicious dishes!</span>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div className="cart-item" key={item.id} id={`cart-item-${item.id}`}>
                    <SecureImage
                      src={getItemImage(item)}
                      alt={item.product?.name}
                      className="cart-item__image"
                    />
                    <div className="cart-item__details">
                      <h4 className="cart-item__name">{item.product?.name}</h4>
                      <span className="cart-item__price">
                        ${Number(item.unitPrice || 0).toFixed(2)}
                      </span>
                      <div className="cart-item__quantity">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.product?.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus />
                        </button>
                        <span className="cart-item__qty-value">{item.quantity}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.product?.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.product?.id)}
                      aria-label={`Remove ${item.product?.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="cart-drawer__footer">
                <div className="cart-drawer__total">
                  <span>Total</span>
                  <span className="cart-drawer__total-amount">
                    ${Number(totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  className="btn btn-primary cart-drawer__checkout"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  id="place-order-btn"
                >
                  {placingOrder ? (
                    <span className="cart-drawer__spinner"></span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default CartDrawer
