import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import './Auth.css'

const Auth = () => {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(loginForm.email, loginForm.password)
    if (result.success) {
      navigate('/')
    }
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await register(registerForm)
    if (result.success) {
      setIsLogin(true)
      setRegisterForm({ firstName: '', lastName: '', email: '', password: '' })
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <div className="auth-page__bg-shape auth-page__bg-shape--1"></div>
        <div className="auth-page__bg-shape auth-page__bg-shape--2"></div>
        <div className="auth-page__bg-shape auth-page__bg-shape--3"></div>
      </div>

      <div className="auth-card" id="auth-card">
        {/* Logo */}
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">
            <svg width="28" height="34" viewBox="0 0 34 41" fill="none">
              <rect width="34" height="41" rx="8" fill="#39DB4A"/>
              <g transform="translate(7.5, 8.5)">
                <path d="M15.49 0C16.0113 0 16.3967 0.0226671 16.646 0.0680012C16.918 0.0906675 17.2127 0.192667 17.53 0.373999C17.87 0.555333 18.108 0.861333 18.244 1.292C18.38 1.72267 18.448 2.30067 18.448 3.026C18.448 3.75133 18.38 4.32933 18.244 4.76C18.108 5.19067 17.87 5.49667 17.53 5.678C17.19 5.83667 16.884 5.93867 16.612 5.984C16.3627 6.00667 15.966 6.018 15.422 6.018H5.018V9.452H11.716C12.26 9.452 12.6567 9.47467 12.906 9.52C13.178 9.54267 13.484 9.64467 13.824 9.826C14.4133 10.166 14.708 11.0613 14.708 12.512C14.708 14.0987 14.2773 15.0393 13.416 15.334C13.0533 15.4473 12.4753 15.504 11.682 15.504H5.018V21.93C5.018 22.474 4.99533 22.8707 4.95 23.12C4.92733 23.3693 4.91249 23.6495 4.64001 23.922C4.54543 24.0166 3.40925 23.922 2.992 23.922C1.40533 23.922 0.476 23.4913 0.204 22.63C0.068 22.2673 0 21.6893 0 20.896V3.992C0 2.836 0.215333 2.054 0.646 1.646C1.07667 1.21533 1.89267 1 3.094 1L15.49 0Z" fill="white"/>
              </g>
            </svg>
          </div>
          <span className="auth-card__logo-text">OODI</span>
        </div>

        {/* Tab Switcher */}
        <div className="auth-card__tabs">
          <button
            className={`auth-card__tab ${isLogin ? 'auth-card__tab--active' : ''}`}
            onClick={() => setIsLogin(true)}
            id="login-tab"
          >
            Sign In
          </button>
          <button
            className={`auth-card__tab ${!isLogin ? 'auth-card__tab--active' : ''}`}
            onClick={() => setIsLogin(false)}
            id="register-tab"
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <form className="auth-card__form" onSubmit={handleLogin} id="login-form">
            <h2 className="auth-card__title">Welcome Back</h2>
            <p className="auth-card__subtitle">Sign in to your account</p>

            <div className="auth-input-group">
              <FiMail className="auth-input-group__icon" />
              <input
                type="email"
                placeholder="Email address"
                className="auth-input"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                id="login-email"
              />
            </div>

            <div className="auth-input-group">
              <FiLock className="auth-input-group__icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="auth-input"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                id="login-password"
              />
              <button
                type="button"
                className="auth-input-group__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-card__submit"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <span className="auth-card__spinner"></span>
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form className="auth-card__form" onSubmit={handleRegister} id="register-form">
            <h2 className="auth-card__title">Create Account</h2>
            <p className="auth-card__subtitle">Join us for delicious meals</p>

            <div className="auth-input-row">
              <div className="auth-input-group">
                <FiUser className="auth-input-group__icon" />
                <input
                  type="text"
                  placeholder="First name"
                  className="auth-input"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  required
                  id="register-firstname"
                />
              </div>
              <div className="auth-input-group">
                <FiUser className="auth-input-group__icon" />
                <input
                  type="text"
                  placeholder="Last name"
                  className="auth-input"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  required
                  id="register-lastname"
                />
              </div>
            </div>

            <div className="auth-input-group">
              <FiMail className="auth-input-group__icon" />
              <input
                type="email"
                placeholder="Email address"
                className="auth-input"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                id="register-email"
              />
            </div>

            <div className="auth-input-group">
              <FiLock className="auth-input-group__icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="auth-input"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                id="register-password"
              />
              <button
                type="button"
                className="auth-input-group__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-card__submit"
              disabled={loading}
              id="register-submit"
            >
              {loading ? (
                <span className="auth-card__spinner"></span>
              ) : (
                <>
                  Create Account <FiArrowRight />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Auth
