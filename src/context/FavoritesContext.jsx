import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorites')
      if (saved && saved !== 'undefined') {
        setFavorites(JSON.parse(saved))
      }
    } catch {
      setFavorites([])
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // Check if a product is in favorites
  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId)
  }

  // Toggle favorite — add or remove
  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      setFavorites((prev) => prev.filter((item) => item.id !== product.id))
      toast.info('Removed from favorites')
    } else {
      setFavorites((prev) => [...prev, product])
      toast.success('Added to favorites ❤️')
    }
  }

  // Remove from favorites
  const removeFavorite = (productId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId))
    toast.info('Removed from favorites')
  }

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem('favorites')
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export default FavoritesContext
