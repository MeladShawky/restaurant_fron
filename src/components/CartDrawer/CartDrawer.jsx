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

  // Promo code states
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  const getItemImage = (item) => {
    if (item.product?.images && item.product.images.length > 0) {
      return ProductService.getImageUrl(item.product.images[0].imageId || item.product.images[0].id)
    }
    return '/images/fattoush_salad_1777635117801.png'
  }

  // Live Calculations
  const subtotal = totalAmount || 0
  let deliveryFee = 3.99
  let discount = 0

  if (appliedPromo === 'MEGA20') {
    if (subtotal >= 500) {
      discount = subtotal * 0.2
    }
  } else if (appliedPromo === 'FIRST15') {
    discount = subtotal * 0.15
  } else if (appliedPromo === 'FEAST10') {
    if (subtotal >= 60) {
      discount = 10.00
    }
  }

  const finalTotal = subtotal + deliveryFee - discount

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase()
    setPromoError('')
    setPromoSuccess('')

    if (code === 'MEGA20') {
      if (subtotal >= 500) {
        setAppliedPromo('MEGA20')
        setPromoSuccess('MEGA20 applied! 20% off your entire order.')
        toast.success('Promo code MEGA20 applied!')
      } else {
        setPromoError('MEGA20 requires a minimum subtotal of $500.00.')
      }
    } else if (code === 'FIRST15') {
      if (!user?.id) {
        setPromoError('Please login to apply this promo code.')
        return
      }
      try {
        const response = await OrderService.getUserOrders(user.id)
        const orders = response?.data || response || []
        if (orders.length === 0) {
          setAppliedPromo('FIRST15')
          setPromoSuccess('FIRST15 applied! 15% discount on your first order.')
          toast.success('Promo code FIRST15 applied!')
        } else {
          setPromoError('FIRST15 is only valid for your first order.')
        }
      } catch (error) {
        console.error('Error verifying order history:', error)
        setPromoError('Failed to verify your order history. Please try again.')
      }
    } else if (code === 'FEAST10') {
      if (subtotal >= 60) {
        setAppliedPromo('FEAST10')
        setPromoSuccess('FEAST10 applied! Flat $10.00 off your order.')
        toast.success('Promo code FEAST10 applied!')
      } else {
        setPromoError('FEAST10 requires a minimum subtotal of $60.00.')
      }
    } else {
      setPromoError('Invalid promo code. Try MEGA20, FIRST15, or FEAST10.')
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoSuccess('')
    setPromoError('')
    toast.info('Promo code removed.')
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
      await OrderService.placeOrder(user.id, appliedPromo)
      setOrderSuccess(true)
      clearCart()
      setAppliedPromo(null)
      setPromoInput('')
      setPromoSuccess('')
      setPromoError('')
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
                {/* Promo Code Input */}
                <div className="cart-drawer__promo">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase())
                      setPromoError('')
                    }}
                    disabled={appliedPromo !== null}
                    className="cart-drawer__promo-input"
                  />
                  {appliedPromo ? (
                    <button
                      className="btn btn-outline cart-drawer__promo-btn cart-drawer__promo-btn--remove"
                      onClick={handleRemovePromo}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary cart-drawer__promo-btn"
                      onClick={handleApplyPromo}
                      disabled={!promoInput.trim()}
                    >
                      Apply
                    </button>
                  )}
                </div>
                {promoError && <p className="cart-drawer__promo-error">{promoError}</p>}
                {promoSuccess && <p className="cart-drawer__promo-success">{promoSuccess}</p>}

                <div className="cart-drawer__divider"></div>

                {/* Detailed Receipt Breakdown */}
                <div className="cart-drawer__breakdown">
                  <div className="cart-drawer__breakdown-row">
                    <span>Subtotal</span>
                    <span>${Number(subtotal).toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="cart-drawer__breakdown-row cart-drawer__breakdown-row--discount">
                      <span>Promo Discount</span>
                      <span>-${Number(discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="cart-drawer__breakdown-row">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'Free' : `$${Number(deliveryFee).toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="cart-drawer__divider"></div>

                <div className="cart-drawer__total">
                  <span>Total</span>
                  <span className="cart-drawer__total-amount">
                    ${Number(finalTotal).toFixed(2)}
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
