import React, { useState } from 'react'
import { FiPercent, FiTruck, FiGift, FiCopy, FiCheck, FiArrowRight } from 'react-icons/fi'
import './Offers.css'

const Offers = () => {
  const [copiedCode, setCopiedCode] = useState(null)

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2000)
  }

  const offerList = [
    {
      id: 1,
      type: 'discount',
      title: '20% OFF BIG ORDERS',
      subtitle: 'Gathering with family or hosting an event? Get 20% off on all orders above $500.',
      code: 'MEGA20',
      badge: 'Big Saver',
      gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
      icon: <FiPercent />
    },
    {
      id: 2,
      type: 'first-order',
      title: 'FIRST ORDER DISCOUNT',
      subtitle: 'Welcome to OODI! Enjoy an exclusive 15% discount on your very first order.',
      code: 'FIRST15',
      badge: 'Welcome',
      gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
      icon: <FiGift />
    },
    {
      id: 3,
      type: 'feast',
      title: 'WEEKEND FEAST DEAL',
      subtitle: 'Enjoy your weekend feast! Get a flat $10.00 discount on orders above $60.',
      code: 'FEAST10',
      badge: 'Feast Deal',
      gradient: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
      icon: <FiTruck />
    }
  ]

  const handleScrollToMenu = (e) => {
    e.preventDefault()
    const menuSection = document.getElementById('menu')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="offers section" id="offers">
      <div className="container">
        <div className="offers__header">
          <span className="section-subtitle">Special Offers</span>
          <h2 className="section-title">
            Best Deals & Promotions<br />For Our Customers
          </h2>
        </div>

        <div className="offers__grid">
          {offerList.map((offer) => (
            <div
              className="offer-card"
              key={offer.id}
              style={{ '--card-gradient': offer.gradient }}
            >
              <div className="offer-card__badge">{offer.badge}</div>
              <div className="offer-card__icon-wrapper">
                {offer.icon}
              </div>
              <div className="offer-card__content">
                <h3 className="offer-card__title">{offer.title}</h3>
                <p className="offer-card__subtitle">{offer.subtitle}</p>

                <div className="offer-card__code-section">
                  <span className="offer-card__code-label">PROMO CODE</span>
                  <div className="offer-card__code-box">
                    <span className="offer-card__code">{offer.code}</span>
                    <button
                      className="offer-card__copy-btn"
                      onClick={() => handleCopyCode(offer.code)}
                      aria-label="Copy coupon code"
                    >
                      {copiedCode === offer.code ? (
                        <FiCheck className="offer-card__check-icon" />
                      ) : (
                        <FiCopy />
                      )}
                    </button>
                  </div>
                </div>

                <a
                  href="#menu"
                  onClick={handleScrollToMenu}
                  className="btn offer-card__action-btn"
                >
                  Order Now <FiArrowRight className="offer-card__arrow" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Offers
