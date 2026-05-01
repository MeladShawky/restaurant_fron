import React, { useState, useEffect } from 'react'
import { GiMeal, GiCroissant, GiCupcake, GiKnifeFork, GiBowlOfRice, GiChickenLeg } from 'react-icons/gi'
import CategoryService from '../../api/categoryService'
import './Categories.css'

// Map of icon components by index for dynamic rendering
const iconMap = [GiMeal, GiCroissant, GiCupcake, GiKnifeFork, GiBowlOfRice, GiChickenLeg]
const colorPalette = [
  { color: '#FF6B35', bgColor: '#FFF3ED' },
  { color: '#6366F1', bgColor: '#EEF2FF' },
  { color: '#EC4899', bgColor: '#FDF2F8' },
  { color: '#1DB954', bgColor: '#E8F9EE' },
  { color: '#F59E0B', bgColor: '#FEF3C7' },
  { color: '#8B5CF6', bgColor: '#F3E8FF' },
]

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await CategoryService.getAllCategories()
      setCategories(response.data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <section className="categories section" id="categories">
        <div className="container">
          <div className="categories__header">
            <span className="section-subtitle">Customer Favorites</span>
            <h2 className="section-title">Popular Categories</h2>
          </div>
          <div className="categories__grid">
            {[1, 2, 3, 4].map((i) => (
              <div className="category-card category-card--skeleton" key={i}>
                <div className="skeleton skeleton--circle"></div>
                <div className="skeleton skeleton--text"></div>
                <div className="skeleton skeleton--text-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="categories section" id="categories">
      <div className="container">
        <div className="categories__header">
          <span className="section-subtitle">Customer Favorites</span>
          <h2 className="section-title">Popular Categories</h2>
        </div>

        <div className="categories__grid">
          {categories.map((category, index) => {
            const IconComponent = iconMap[index % iconMap.length]
            const colors = colorPalette[index % colorPalette.length]

            return (
              <div
                className="category-card"
                key={category.id}
                id={`category-${category.id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="category-card__icon"
                  style={{
                    backgroundColor: colors.bgColor,
                    color: colors.color,
                  }}
                >
                  <IconComponent />
                </div>
                <h3 className="category-card__name">{category.name}</h3>
                <span className="category-card__count">
                  {category.products?.length || 0} items
                </span>
              </div>
            )
          })}
        </div>

        {error && <p className="categories__error">{error}</p>}
      </div>
    </section>
  )
}

export default Categories
