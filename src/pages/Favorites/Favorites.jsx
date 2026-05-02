import React from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import { useFavorites } from '../../context/FavoritesContext'
import { useCart } from '../../context/CartContext'
import SecureImage from '../../components/SecureImage/SecureImage'
import './Favorites.css'

const Favorites = () => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const { addToCart } = useCart()

  const handleAddToCart = (productId) => {
    addToCart(productId, 1)
  }

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="favorites-page__header">
          <Link to="/" className="favorites-page__back">
            <FiArrowLeft /> Back to Home
          </Link>
          <div className="favorites-page__header-top">
            <div>
              <h1 className="favorites-page__title">
                <FiHeart className="favorites-page__title-icon" /> My Favorites
              </h1>
              <p className="favorites-page__subtitle">
                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                className="btn btn-outline favorites-page__clear-btn"
                onClick={clearFavorites}
                id="clear-favorites-btn"
              >
                <FiTrash2 /> Clear All
              </button>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="favorites-page__empty">
            <div className="favorites-page__empty-icon-wrapper">
              <FiHeart />
            </div>
            <h3>No favorites yet</h3>
            <p>Tap the heart icon on dishes you love to save them here</p>
            <Link to="/" className="btn btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="favorites-page__grid">
            {favorites.map((item, index) => (
              <div
                className="favorite-card"
                key={item.id}
                id={`favorite-${item.id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="favorite-card__image-wrapper">
                  <SecureImage
                    src={item.image}
                    alt={item.name}
                    className="favorite-card__image"
                  />
                  <button
                    className="favorite-card__remove"
                    onClick={() => removeFavorite(item.id)}
                    aria-label={`Remove ${item.name} from favorites`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="favorite-card__content">
                  <h3 className="favorite-card__name">{item.name}</h3>
                  <p className="favorite-card__description">
                    {item.description || 'Delicious dish from our kitchen'}
                  </p>
                  <div className="favorite-card__footer">
                    <span className="favorite-card__price">
                      <span className="favorite-card__price-symbol">$</span>
                      {Number(item.price).toFixed(2)}
                    </span>
                    <button
                      className="btn btn-primary favorite-card__cart-btn"
                      onClick={() => handleAddToCart(item.id)}
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
