import React, { useState, useEffect, useRef } from 'react'
import { FiSearch, FiX, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import ProductService from '../../api/productService'
import SecureImage from '../SecureImage/SecureImage'
import './SearchOverlay.css'

const SearchOverlay = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  // Load products when open
  useEffect(() => {
    if (isOpen) {
      fetchProducts()
      // Delay focus slightly to let open animation complete
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSearchQuery('')
      setFilteredProducts([])
    }
  }, [isOpen])

  // Key press handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await ProductService.getAllProducts()
      setProducts(response.data || [])
    } catch (err) {
      console.error('Error fetching products for search:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    )
    setFilteredProducts(filtered)
  }, [searchQuery, products])

  const handleToggleFavorite = (product) => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: getProductImage(product),
    })
  }

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return ProductService.getImageUrl(product.images[0].imageId || product.images[0].id)
    }
    return '/images/fattoush_salad_1777635117801.png'
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-overlay__container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="search-overlay__header">
          <div className="search-overlay__search-box">
            <FiSearch className="search-overlay__search-icon" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for delicious food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-overlay__input"
            />
            {searchQuery && (
              <button
                className="search-overlay__clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
          <button className="search-overlay__close-btn" onClick={onClose} aria-label="Close search">
            <FiX />
          </button>
        </div>

        {/* Results / Content */}
        <div className="search-overlay__content">
          {loading ? (
            <div className="search-overlay__skeleton-grid">
              {[1, 2, 3, 4].map((i) => (
                <div className="search-result-card search-result-card--skeleton" key={i}>
                  <div className="skeleton skeleton--image-compact"></div>
                  <div className="search-result-card__info">
                    <div className="skeleton skeleton--text-short"></div>
                    <div className="skeleton skeleton--text-veryshort"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="search-overlay__intro">
              <h3>Craving something delicious?</h3>
              <p>Type in dish names like "salad", "pizza", "burger", etc.</p>
              
              {/* Quick suggestions if products are loaded */}
              {products.length > 0 && (
                <div className="search-overlay__suggestions">
                  <span className="search-overlay__suggestions-title">Popular Suggestions:</span>
                  <div className="search-overlay__suggestion-tags">
                    {['Salad', 'Burger', 'Soup', 'Pizza', 'Fries']
                      .filter(tag => products.some(p => p.name?.toLowerCase().includes(tag.toLowerCase())))
                      .map(tag => (
                        <button 
                          key={tag} 
                          className="search-overlay__tag"
                          onClick={() => setSearchQuery(tag)}
                        >
                          {tag}
                        </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="search-overlay__no-results">
              <div className="search-overlay__no-results-icon">
                <FiSearch />
              </div>
              <h3>No dishes found</h3>
              <p>We couldn't find any dishes matching "{searchQuery}". Try something else!</p>
            </div>
          ) : (
            <div className="search-overlay__results-grid">
              {filteredProducts.map((product) => (
                <div className="search-result-card" key={product.id}>
                  <div className="search-result-card__img-wrapper">
                    <SecureImage
                      src={getProductImage(product)}
                      alt={product.name}
                      className="search-result-card__image"
                    />
                    <button
                      className={`search-result-card__like-btn ${isFavorite(product.id) ? 'search-result-card__like-btn--active' : ''}`}
                      onClick={() => handleToggleFavorite(product)}
                      aria-label="Toggle favorite"
                    >
                      <FiHeart />
                    </button>
                  </div>
                  
                  <div className="search-result-card__info">
                    <div className="search-result-card__details">
                      <h4 className="search-result-card__name">{product.name}</h4>
                      <p className="search-result-card__desc">
                        {product.description || 'Delicious dish from our kitchen'}
                      </p>
                    </div>
                    
                    <div className="search-result-card__footer">
                      <span className="search-result-card__price">
                        ${Number(product.price || 0).toFixed(2)}
                      </span>
                      
                      <div className="search-result-card__actions">
                        <span className="search-result-card__rating">
                          <FiStar className="search-result-card__star" /> 4.8
                        </span>
                        <button
                          className="btn btn-primary search-result-card__add-btn"
                          onClick={() => addToCart(product.id, 1)}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <FiShoppingCart /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchOverlay
