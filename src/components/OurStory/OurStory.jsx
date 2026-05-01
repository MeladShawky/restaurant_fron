import React from 'react'
import { FiTruck, FiGift, FiShoppingBag, FiCoffee } from 'react-icons/fi'
import './OurStory.css'

const servicesData = [
  {
    id: 1,
    icon: <FiCoffee />,
    title: 'Catering',
    description: 'Delight your guests with our flavors and presentation',
    color: '#1DB954',
    bgColor: '#E8F9EE',
  },
  {
    id: 2,
    icon: <FiTruck />,
    title: 'Fast Delivery',
    description: 'We deliver your order promptly to your door',
    color: '#FF6B35',
    bgColor: '#FFF3ED',
  },
  {
    id: 3,
    icon: <FiShoppingBag />,
    title: 'Online Ordering',
    description: 'Explore menu & order with ease using our app',
    color: '#6366F1',
    bgColor: '#EEF2FF',
  },
  {
    id: 4,
    icon: <FiGift />,
    title: 'Gift Cards',
    description: 'Give the gift of exceptional dining experience',
    color: '#EC4899',
    bgColor: '#FDF2F8',
  },
]

const OurStory = () => {
  return (
    <section className="our-story section" id="services">
      <div className="container">
        <div className="our-story__container">
          {/* Left Content */}
          <div className="our-story__content">
            <span className="section-subtitle">Our Story & Services</span>
            <h2 className="section-title">
              Our Culinary Journey
              <br />
              And Services
            </h2>
            <p className="our-story__description">
              Rooted in passion, we curate unforgettable dining
              experiences and offer exceptional services,
              blending culinary artistry with warm hospitality.
            </p>
            <button className="btn btn-primary our-story__btn" id="explore-btn">
              Explore
            </button>
          </div>

          {/* Right - Service Cards Grid */}
          <div className="our-story__services">
            {servicesData.map((service, index) => (
              <div
                className="service-card"
                key={service.id}
                id={`service-${service.id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="service-card__icon"
                  style={{
                    backgroundColor: service.bgColor,
                    color: service.color,
                  }}
                >
                  {service.icon}
                </div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default OurStory
