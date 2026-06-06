import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiChevronDown, FiLogOut, FiHeart, FiPackage, FiSun, FiMoon } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useTheme } from '../../context/ThemeContext'
import SecureImage from '../SecureImage/SecureImage'
import './Navbar.css'

const Navbar = ({ onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const { favoritesCount } = useFavorites()
  const { theme, toggleTheme } = useTheme()

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
            <svg width="24" height="29" viewBox="0 0 34 41" fill="none">
              <rect width="34" height="41" rx="8" fill="#39DB4A" />
              <g transform="translate(7.5, 8.5)">
                <path d="M15.49 0C16.0113 0 16.3967 0.0226671 16.646 0.0680012C16.918 0.0906675 17.2127 0.192667 17.53 0.373999C17.87 0.555333 18.108 0.861333 18.244 1.292C18.38 1.72267 18.448 2.30067 18.448 3.026C18.448 3.75133 18.38 4.32933 18.244 4.76C18.108 5.19067 17.87 5.49667 17.53 5.678C17.19 5.83667 16.884 5.93867 16.612 5.984C16.3627 6.00667 15.966 6.018 15.422 6.018H5.018V9.452H11.716C12.26 9.452 12.6567 9.47467 12.906 9.52C13.178 9.54267 13.484 9.64467 13.824 9.826C14.4133 10.166 14.708 11.0613 14.708 12.512C14.708 14.0987 14.2773 15.0393 13.416 15.334C13.0533 15.4473 12.4753 15.504 11.682 15.504H5.018V21.93C5.018 22.474 4.99533 22.8707 4.95 23.12C4.92733 23.3693 4.91249 23.6495 4.64001 23.922C4.54543 24.0166 3.40925 23.922 2.992 23.922C1.40533 23.922 0.476 23.4913 0.204 22.63C0.068 22.2673 0 21.6893 0 20.896V3.992C0 2.836 0.215333 2.054 0.646 1.646C1.07667 1.21533 1.89267 1 3.094 1L15.49 0Z" fill="white" />
              </g>
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

        <div className="navbar__actions">
          <button 
            className="navbar__icon-btn theme-toggle-btn" 
            id="theme-toggle-btn" 
            onClick={toggleTheme} 
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
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
                  {user?.profileImage?.downloadUrl ? (
                    <SecureImage
                      src={user.profileImage.downloadUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="navbar__user-avatar-img"
                    />
                  ) : (
                    user?.firstName?.charAt(0) || 'U'
                  )}
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
