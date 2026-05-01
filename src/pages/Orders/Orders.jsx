import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import OrderService from '../../api/orderService'
import './Orders.css'

const statusConfig = {
  PENDING: { icon: <FiClock />, color: '#F59E0B', bg: '#FEF3C7', label: 'Pending' },
  PROCESSING: { icon: <FiPackage />, color: '#6366F1', bg: '#EEF2FF', label: 'Processing' },
  SHIPPED: { icon: <FiTruck />, color: '#3B82F6', bg: '#DBEAFE', label: 'Shipped' },
  DELIVERED: { icon: <FiCheckCircle />, color: '#1DB954', bg: '#E8F9EE', label: 'Delivered' },
  CANCELLED: { icon: <FiPackage />, color: '#EF4444', bg: '#FEE2E2', label: 'Cancelled' },
}

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await OrderService.getUserOrders(user.id)
      setOrders(response.data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatus = (status) => {
    return statusConfig[status] || statusConfig.PENDING
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-page__header">
          <Link to="/" className="orders-page__back">
            <FiArrowLeft /> Back to Home
          </Link>
          <h1 className="orders-page__title">My Orders</h1>
          <p className="orders-page__subtitle">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="orders-page__loading">
            {[1, 2, 3].map((i) => (
              <div className="order-card order-card--skeleton" key={i}>
                <div className="skeleton skeleton--text"></div>
                <div className="skeleton skeleton--text-sm"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-page__empty">
            <FiPackage className="orders-page__empty-icon" />
            <h3>No orders yet</h3>
            <p>Start ordering delicious food from our menu!</p>
            <Link to="/" className="btn btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="orders-page__list">
            {orders.map((order) => {
              const status = getStatus(order.orderStatus || order.status)
              return (
                <div className="order-card" key={order.orderId || order.id} id={`order-${order.orderId || order.id}`}>
                  <div className="order-card__header">
                    <div className="order-card__id">
                      <FiPackage />
                      <span>Order #{order.orderId || order.id}</span>
                    </div>
                    <div
                      className="order-card__status"
                      style={{ backgroundColor: status.bg, color: status.color }}
                    >
                      {status.icon}
                      {status.label}
                    </div>
                  </div>

                  <div className="order-card__body">
                    <div className="order-card__info">
                      <div className="order-card__info-item">
                        <span className="order-card__label">Date</span>
                        <span className="order-card__value">
                          {formatDate(order.orderDate || order.createdAt)}
                        </span>
                      </div>
                      <div className="order-card__info-item">
                        <span className="order-card__label">Items</span>
                        <span className="order-card__value">
                          {order.items?.length || order.orderItems?.length || 0} items
                        </span>
                      </div>
                      <div className="order-card__info-item">
                        <span className="order-card__label">Total</span>
                        <span className="order-card__value order-card__value--price">
                          ${Number(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
