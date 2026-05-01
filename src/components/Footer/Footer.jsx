import React from 'react'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <a href="#" className="footer__logo">
              <div className="footer__logo-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="14" fill="#1DB954"/>
                  <circle cx="10" cy="12" r="3" fill="white"/>
                  <circle cx="18" cy="12" r="3" fill="white"/>
                  <path d="M9 18 C11 21, 17 21, 19 18" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <span className="footer__logo-text">OODI</span>
            </a>
            <p className="footer__brand-description">
              Savor the artistry where every dish is a culinary
              masterpiece
            </p>
          </div>

          {/* Useful Links */}
          <div className="footer__column">
            <h4 className="footer__column-title">Useful Links</h4>
            <ul className="footer__links">
              <li><a href="#" className="footer__link">About Us</a></li>
              <li><a href="#" className="footer__link">Events</a></li>
              <li><a href="#" className="footer__link">Blogs</a></li>
              <li><a href="#" className="footer__link">FAQ</a></li>
            </ul>
          </div>

          {/* Side Menu */}
          <div className="footer__column">
            <h4 className="footer__column-title">Side Menu</h4>
            <ul className="footer__links">
              <li><a href="#" className="footer__link">Home</a></li>
              <li><a href="#" className="footer__link">Offers</a></li>
              <li><a href="#" className="footer__link">Menus</a></li>
              <li><a href="#" className="footer__link">Reservation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__column">
            <h4 className="footer__column-title">Contact Us</h4>
            <ul className="footer__links">
              <li><span className="footer__contact-item">example@gmail.com</span></li>
              <li><span className="footer__contact-item">+64 958 248 966</span></li>
              <li><span className="footer__contact-item">Social media</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Facebook" id="social-facebook">
              <FiFacebook />
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram" id="social-instagram">
              <FiInstagram />
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter" id="social-twitter">
              <FiTwitter />
            </a>
            <a href="#" className="footer__social-link" aria-label="LinkedIn" id="social-linkedin">
              <FiLinkedin />
            </a>
          </div>
          <p className="footer__copyright">
            Copyright &copy; 2025 Starter | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
