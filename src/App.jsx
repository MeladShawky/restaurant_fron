import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ThemeProvider } from './context/ThemeContext'

import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Categories from './components/Categories/Categories'
import SpecialDishes from './components/SpecialDishes/SpecialDishes'
import Testimonials from './components/Testimonials/Testimonials'
import OurStory from './components/OurStory/OurStory'
import Footer from './components/Footer/Footer'
import CartDrawer from './components/CartDrawer/CartDrawer'
import SearchOverlay from './components/SearchOverlay/SearchOverlay'
import Auth from './pages/Auth/Auth'
import Orders from './pages/Orders/Orders'
import Favorites from './pages/Favorites/Favorites'

// Home page (all sections)
const HomePage = () => (
  <>
    <Hero />
    <Categories />
    <SpecialDishes />
    <Testimonials />
    <OurStory />
  </>
)

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className="app">
                <Navbar 
                  onCartClick={() => setIsCartOpen(true)} 
                  onSearchClick={() => setIsSearchOpen(true)} 
                />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
                <Footer />

                {/* Cart Drawer */}
                <CartDrawer
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                />

                {/* Search Overlay */}
                <SearchOverlay
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                />

                {/* Toast Notifications */}
                <ToastContainer
                  position="bottom-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </div>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
