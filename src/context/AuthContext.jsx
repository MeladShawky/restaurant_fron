import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Decode JWT token payload
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

// Safely parse JSON from localStorage
const safeParseJSON = (str) => {
  try {
    if (!str || str === 'undefined' || str === 'null') return null
    return JSON.parse(str)
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const isAuthenticated = !!token

  const fetchUserDetails = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/user`)
      if (response.data && response.data.data) {
        const fullUser = response.data.data
        localStorage.setItem('user', JSON.stringify(fullUser))
        setUser(fullUser)
        return fullUser
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
    return null
  }

  // Initialize user from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token')

    if (savedToken && savedToken !== 'undefined') {
      setToken(savedToken)

      // Try to get user from localStorage first
      let parsed = safeParseJSON(localStorage.getItem('user'))

      // If no valid user object, extract info from JWT
      if (!parsed) {
        const decoded = decodeToken(savedToken)
        if (decoded) {
          parsed = {
            id: decoded.id,
            email: decoded.sub,
            roles: decoded.roles || [],
          }
          localStorage.setItem('user', JSON.stringify(parsed))
        }
      }

      if (parsed) {
        setUser(parsed)
        fetchUserDetails(parsed.id)
      }
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    setLoading(false)
  }, [])

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const responseData = response.data
      console.log('Login response:', responseData)

      let jwtToken = null
      let userData = null

      // Structure: { data: { token, ... } }
      if (responseData?.data?.token) {
        jwtToken = responseData.data.token
      }
      // Structure: { token, ... }
      else if (responseData?.token) {
        jwtToken = responseData.token
      }
      // Structure: { accessToken, ... }
      else if (responseData?.accessToken) {
        jwtToken = responseData.accessToken
      }

      if (!jwtToken) {
        console.error('Could not extract token from response:', responseData)
        toast.error('Login failed: unexpected response format')
        return { success: false, message: 'Unexpected response format' }
      }

      // Extract user data from response OR decode from JWT
      userData =
        responseData?.data?.user ||
        responseData?.user ||
        null

      // If no user object in response, build one from JWT
      if (!userData || typeof userData !== 'object') {
        const decoded = decodeToken(jwtToken)
        userData = {
          id: decoded?.id,
          email: decoded?.sub || email,
          roles: decoded?.roles || [],
        }
      }

      // Ensure user has an id
      if (!userData.id) {
        const decoded = decodeToken(jwtToken)
        userData.id = decoded?.id
      }

      console.log('Saving user data:', userData)

      localStorage.setItem('token', jwtToken)
      setToken(jwtToken)

      // Fetch full user details to populate address and profile picture
      try {
        const userDetailsResponse = await api.get(`/users/${userData.id}/user`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        })
        if (userDetailsResponse.data?.data) {
          userData = userDetailsResponse.data.data
        }
      } catch (err) {
        console.error('Failed to fetch user details during login:', err)
      }

      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Register
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      toast.success('Registration successful! Please login.')
      return { success: true, data: response.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.info('Logged out successfully')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        fetchUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
