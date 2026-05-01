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
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#1DB954"/>
              <circle cx="10" cy="12" r="3" fill="white"/>
              <circle cx="18" cy="12" r="3" fill="white"/>
              <path d="M9 18 C11 21, 17 21, 19 18" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
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
