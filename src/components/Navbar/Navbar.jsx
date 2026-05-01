import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiChevronDown, FiLogOut, FiHeart, FiPackage } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import './Navbar.css'

const Navbar = ({ onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const { favoritesCount } = useFavorites()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} id="navbar">
      <div className="container navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="navbar-logo">
          <div className="navbar__logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#1DB954"/>
              <circle cx="10" cy="12" r="3" fill="white"/>
              <circle cx="18" cy="12" r="3" fill="white"/>
              <path d="M9 18 C11 21, 17 21, 19 18" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <span className="navbar__logo-text">OODI</span>
        </Link>

        {/* Navigation Links */}
        <ul className={`navbar__links ${isMobileMenuOpen ? 'navbar__links--open' : ''}`} id="navbar-links">
          <li><a href="/#hero" className="navbar__link navbar__link--active">Home</a></li>
          <li className="navbar__dropdown">
            <a href="/#menu" className="navbar__link">
              Menu <FiChevronDown className="navbar__dropdown-icon" />
            </a>
          </li>
          <li className="navbar__dropdown">
            <a href="/#services" className="navbar__link">
              Services <FiChevronDown className="navbar__dropdown-icon" />
            </a>
          </li>
          <li><a href="/#offers" className="navbar__link">Offers</a></li>
        </ul>

        {/* Right Side */}
        <div className="navbar__actions">
          <button className="navbar__icon-btn" id="search-btn" aria-label="Search">
            <FiSearch />
          </button>
          <Link to="/favorites" className="navbar__icon-btn navbar__fav-btn" id="favorites-btn" aria-label="Favorites">
            <FiHeart />
            {favoritesCount > 0 && (
              <span className="navbar__fav-badge">{favoritesCount}</span>
            )}
          </Link>
          <button className="navbar__icon-btn navbar__cart-btn" id="cart-btn" aria-label="Cart" onClick={onCartClick}>
            <FiShoppingCart />
            {itemCount > 0 && (
              <span className="navbar__cart-badge">{itemCount}</span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="navbar__user-menu-wrapper">
              <button
                className="navbar__user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="user-menu-btn"
              >
                <div className="navbar__user-avatar">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              </button>

              {showUserMenu && (
                <div className="navbar__user-dropdown" id="user-dropdown">
                  <div className="navbar__user-info">
                    <span className="navbar__user-name">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="navbar__user-email">{user?.email}</span>
                  </div>
                  <div className="navbar__user-divider"></div>
                  <Link to="/favorites" className="navbar__user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FiHeart /> My Favorites
                  </Link>
                  <Link to="/orders" className="navbar__user-dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FiPackage /> My Orders
                  </Link>
                  <button className="navbar__user-dropdown-item" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary navbar__contact-btn" id="login-btn">
              Login
            </Link>
          )}

          <button className="navbar__mobile-toggle" id="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
