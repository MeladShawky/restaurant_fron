import React from 'react'
import { FiStar } from 'react-icons/fi'
import './Testimonials.css'

const Testimonials = () => {
  return (
    <section className="testimonials section" id="testimonials">
      <div className="container testimonials__container">
        {/* Left - Chef Image */}
        <div className="testimonials__image-side">
          <div className="testimonials__portal">
            <div className="testimonials__arch-bg">
              <img
                src="/images/chef_portrait_1777635185584.png"
                alt="Our chef"
                className="testimonials__chef-image"
              />
            </div>
            <img
              src="/images/chef_portrait_1777635185584.png"
              alt="Our chef"
              className="testimonials__chef-image testimonials__chef-image--top"
            />
            
            {/* Emojis */}
            <div className="testimonials__emoji testimonials__emoji--left">😋</div>
            <div className="testimonials__emoji testimonials__emoji--right">🍕</div>

            <div className="testimonials__chef-badge">
              <span>Our Best Chef 😁</span>
            </div>
          </div>
        </div>

        {/* Right - Testimonial Content */}
        <div className="testimonials__content">
          <span className="section-subtitle">Testimonials</span>
          <h2 className="section-title">
            What Our Customers
            <br />
            Say About Us
          </h2>

          <div className="testimonials__quote">
            <p className="testimonials__text">
              "I had the pleasure of dining at Oodi last night, and
              I'm still raving about the experience! The attention to
              detail in presentation and service was impeccable."
            </p>
          </div>

          <div className="testimonials__author">
            <div className="testimonials__author-avatar">
              <span>CF</span>
            </div>
            <div className="testimonials__author-info">
              <span className="testimonials__author-label">Customer Feedback</span>
              <div className="testimonials__rating">
                <FiStar className="testimonials__star" />
                <span className="testimonials__rating-value">4.9</span>
                <span className="testimonials__rating-count">(18.6k Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
