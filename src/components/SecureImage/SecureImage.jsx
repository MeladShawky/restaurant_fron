import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import './SecureImage.css'

const SecureImage = ({ src, alt, className, fallback = '/images/fattoush_salad_1777635117801.png' }) => {
  const [imageSrc, setImageSrc] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let objectUrl = null
    let isMounted = true

    const fetchImage = async () => {
      if (!src) {
        if (isMounted) {
          setImageSrc(fallback)
          setLoading(false)
        }
        return
      }

      // If it's a local fallback image, a relative path, or data URI, just use it directly
      if ((src.startsWith('/') && !src.includes('/api/v1/')) || src.startsWith('data:') || src.startsWith('blob:')) {
        if (isMounted) {
          setImageSrc(src)
          setLoading(false)
        }
        return
      }

      try {
        if (isMounted) setLoading(true)

        // Normalize URL to work with our axios instance base URL
        // Example: If src is "http://localhost:8080/api/v1/images/image/download/1"
        // We only want the part after "/api/v1" so it uses axios properly with the proxy/interceptor
        let fetchUrl = src
        if (src.includes('/api/v1')) {
          fetchUrl = src.split('/api/v1')[1]
        }
        
        const response = await api.get(fetchUrl, {
          responseType: 'blob'
        })
        
        objectUrl = URL.createObjectURL(response.data)
        if (isMounted) {
          setImageSrc(objectUrl)
        }
      } catch (err) {
        console.error('SecureImage fetch failed for src:', src, 'fetchUrl:', fetchUrl, err)
        // Silently use fallback on error
        if (isMounted) {
          setImageSrc(fallback)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchImage()

    // Cleanup the object URL when component unmounts or src changes
    return () => {
      isMounted = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [src, fallback])

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={`${className || ''} ${loading ? 'secure-image-loading' : 'secure-image-loaded'}`}
    />
  )
}

export default SecureImage
