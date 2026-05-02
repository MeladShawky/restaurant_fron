import React, { useState, useEffect } from 'react'
import { 
  GiMeal, GiCroissant, GiCupcake, GiKnifeFork, GiBowlOfRice, 
  GiChickenLeg, GiHamburger, GiPizzaSlice, GiWaterBottle, GiCoffeeCup 
} from 'react-icons/gi'
import CategoryService from '../../api/categoryService'
import ProductService from '../../api/productService'
import './Categories.css'

const getIconForCategory = (name) => {
  if (!name) return GiMeal
  const lowerName = name.toLowerCase()
  if (lowerName.includes('burger') || lowerName.includes('sandwich')) return GiHamburger
  if (lowerName.includes('pizza')) return GiPizzaSlice
  if (lowerName.includes('drink') || lowerName.includes('beverage')) return GiWaterBottle
  if (lowerName.includes('coffee') || lowerName.includes('cafe')) return GiCoffeeCup
  if (lowerName.includes('dessert') || lowerName.includes('sweet') || lowerName.includes('cake')) return GiCupcake
  if (lowerName.includes('chicken') || lowerName.includes('meat')) return GiChickenLeg
  if (lowerName.includes('salad') || lowerName.includes('vegan') || lowerName.includes('healthy')) return GiBowlOfRice
  if (lowerName.includes('breakfast') || lowerName.includes('bakery')) return GiCroissant
  return GiMeal
}
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
      const [catResponse, prodResponse] = await Promise.all([
        CategoryService.getAllCategories(),
        ProductService.getAllProducts()
      ])
      
      const cats = catResponse.data || []
      const prods = prodResponse.data || []
      
      // Calculate product counts
      const categoriesWithCount = cats.map(cat => {
        const count = prods.filter(p => p.category?.id === cat.id || p.category?.name === cat.name).length
        return {
          ...cat,
          productCount: count
        }
      })
      
      setCategories(categoriesWithCount)
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
            const IconComponent = getIconForCategory(category.name)
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
                  {category.productCount || 0} items
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
