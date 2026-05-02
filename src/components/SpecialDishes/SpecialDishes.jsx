import React, { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi'
import ProductService from '../../api/productService'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import SecureImage from '../SecureImage/SecureImage'
import './SpecialDishes.css'

const SpecialDishes = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await ProductService.getAllProducts()
      setProducts(response.data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(products.length - 3, 0) : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= products.length - 3 ? 0 : prev + 1))
  }

  const handleToggleFavorite = (product) => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: getProductImage(product),
    })
  }

  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
  }

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return ProductService.getImageUrl(product.images[0].imageId || product.images[0].id)
    }
    return '/images/fattoush_salad_1777635117801.png' // fallback
  }

  // Get the dishes to display (sliding window of 3)
  const visibleDishes = products.slice(currentIndex, currentIndex + 3)

  // Loading skeleton
  if (loading) {
    return (
      <section className="special-dishes section" id="menu">
        <div className="container">
          <div className="special-dishes__header">
            <div className="special-dishes__header-text">
              <span className="section-subtitle">Special Dishes</span>
              <h2 className="section-title">
                Standout Dishes<br />From Our Menu
              </h2>
            </div>
          </div>
          <div className="special-dishes__grid">
            {[1, 2, 3].map((i) => (
              <div className="dish-card dish-card--skeleton" key={i}>
                <div className="skeleton skeleton--image"></div>
                <div className="dish-card__content">
                  <div className="skeleton skeleton--text"></div>
                  <div className="skeleton skeleton--text-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="special-dishes section" id="menu">
      <div className="container">
        <div className="special-dishes__header">
          <div className="special-dishes__header-text">
            <span className="section-subtitle">Special Dishes</span>
            <h2 className="section-title">
              Standout Dishes
              <br />
              From Our Menu
            </h2>
          </div>
          {products.length > 3 && (
            <div className="special-dishes__nav">
              <button
                className="special-dishes__nav-btn"
                onClick={handlePrev}
                id="dishes-prev-btn"
                aria-label="Previous dish"
              >
                <FiChevronLeft />
              </button>
              <button
                className="special-dishes__nav-btn special-dishes__nav-btn--active"
                onClick={handleNext}
                id="dishes-next-btn"
                aria-label="Next dish"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>

        <div className="special-dishes__grid">
          {visibleDishes.map((product, index) => (
            <div
              className="dish-card"
              key={product.id}
              id={`dish-${product.id}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="dish-card__image-wrapper">
                <button
                  className={`dish-card__like-btn ${isFavorite(product.id) ? 'dish-card__like-btn--active' : ''}`}
                  onClick={() => handleToggleFavorite(product)}
                  aria-label={`Like ${product.name}`}
                >
                  <FiHeart />
                </button>
                <SecureImage
                  src={getProductImage(product)}
                  alt={product.name}
                  className="dish-card__image"
                />
              </div>
              <div className="dish-card__content">
                <h3 className="dish-card__name">{product.name}</h3>
                <p className="dish-card__description">
                  {product.description || 'Delicious dish from our kitchen'}
                </p>
                <div className="dish-card__footer">
                  <span className="dish-card__price">
                    <span className="dish-card__price-symbol">$</span>
                    {Number(product.price).toFixed(2)}
                  </span>
                  <div className="dish-card__actions">
                    <div className="dish-card__rating">
                      <FiStar className="dish-card__star" />
                      4.8
                    </div>
                    <button
                      className="dish-card__cart-btn"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <FiShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <p className="special-dishes__empty">No dishes available at the moment.</p>
        )}
      </div>
    </section>
  )
}

export default SpecialDishes
