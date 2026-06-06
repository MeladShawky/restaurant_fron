import React from 'react'
import { FiPlay, FiStar } from 'react-icons/fi'
import './Hero.css'

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="container hero__container">
        {/* Left Content */}
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot"></span>
            Restaurant Website
          </div>
          <h1 className="hero__title">
            Dive into Delights
            <br />
            Of Delectable{' '}
            <span className="hero__title-highlight">Food</span>
          </h1>
          <p className="hero__description">
            Where Each Plate Weaves a Story of Culinary
            Mastery and Passionate Craftsmanship
          </p>
          <div className="hero__actions">
            <button className="btn btn-primary hero__order-btn" id="order-now-btn">
              Order Now
            </button>
            <button className="hero__watch-btn" id="watch-video-btn">
              <div className="hero__play-icon">
                <FiPlay />
              </div>
              Watch Video
            </button>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="hero__visual">
          <div className="hero__image-portal">
            <div className="hero__image-bg-circle">
              <img
                src="/images/hero_girl_1777635170749.png"
                alt="Enjoying delicious food"
                className="hero__girl-image"
              />
            </div>
            <img
              src="/images/hero_girl_1777635170749.png"
              alt="Enjoying delicious food"
              className="hero__girl-image hero__girl-image--top"
            />
          </div>


          {/* Floating Bubble */}
          <div className="hero__bubble">
            <span className="hero__bubble-text">Hot spicy Food 🌶️</span>
          </div>

          {/* Floating Food Cards */}
          <div className="hero__food-card hero__food-card--left">
            <img src="/images/spicy_noodles_1777635202985.png" alt="Spicy noodles" className="hero__food-card-img" />
            <div className="hero__food-card-info">
              <span className="hero__food-card-name">Spicy noodles</span>
              <div className="hero__food-card-stars">
                <FiStar fill="#FFC107" color="#FFC107" />
                <FiStar fill="#FFC107" color="#FFC107" />
                <FiStar fill="#FFC107" color="#FFC107" />
                <FiStar color="#D1D5DB" />
                <FiStar color="#D1D5DB" />
              </div>
              <span className="hero__food-card-price"><span className="hero__price-symbol">$</span>18.00</span>
            </div>
          </div>

          <div className="hero__food-card hero__food-card--right">
            <img src="/images/vegetable_salad_1777635139884.png" alt="Vegetarian salad" className="hero__food-card-img" />
            <div className="hero__food-card-info">
              <span className="hero__food-card-name">Vegetarian salad</span>
              <div className="hero__food-card-stars">
                <FiStar fill="#FFC107" color="#FFC107" />
                <FiStar fill="#FFC107" color="#FFC107" />
                <FiStar fill="#FFC107" color="#FFC107" />
                <FiStar fill="#FFC107" color="#FFC107" />
                <FiStar color="#D1D5DB" />
              </div>
              <span className="hero__food-card-price"><span className="hero__price-symbol">$</span>23.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="hero__decor hero__decor--1"></div>
      <div className="hero__decor hero__decor--2"></div>
    </section>
  )
}

export default Hero
