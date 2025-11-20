import React from 'react'
import './Footer.css'

const SocialIcon = ({ children, label }) => (
  <button className="fa-icon" aria-label={label} title={label} type="button">
    {children}
  </button>
)

const Footer = () => {
  const handleTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>About True</h4>
            <ul>
              <li>Our Company</li>
              <li>Sustainability</li>
              <li>True Blog</li>
              <li>Newsroom</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Careers</h4>
            <ul>
              <li>Careers</li>
              <li>True Next Gen</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Investor Relations</h4>
            <ul>
              <li>Overview</li>
              <li>Stock Price</li>
              <li>Financial & Operational Information</li>
              <li>Executive Management & Governance</li>
              <li>Shareholder Center</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Terms of Service</h4>
            <ul>
              <li>Compliance with Regulations</li>
              <li>Privacy Notice</li>
              <li>Complain</li>
              <li>True Information Security Policy</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Help Center</h4>
            <ul>
              <li>FAQs</li>
              <li>Help Services</li>
              <li>How to update/change owner</li>
            </ul>
          </div>
        </div>

        <hr className="footer-sep" />

        <div className="footer-bottom">
          <div className="app-section">
            <div className="app-title">ดาวน์โหลดแอปทรู</div>
            <div className="app-badges">
              <div className="badge google">
                <div className="badge-logo">▶</div>
                <div className="badge-text">
                  <div className="small">GET IT ON</div>
                  <div className="big">Google Play</div>
                </div>
              </div>

              <div className="badge apple">
                <div className="badge-logo"></div>
                <div className="badge-text">
                  <div className="small">Download on the</div>
                  <div className="big">App Store</div>
                </div>
              </div>
            </div>
          </div>

          <div className="social-section">
            <div className="follow">Follow us</div>
            <div className="social-icons">
              <SocialIcon label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.17 8.44 9.93v-7.03H8.08v-2.9h2.36V9.41c0-2.33 1.4-3.61 3.54-3.61 1.02 0 2.08.18 2.08.18v2.28h-1.17c-1.15 0-1.51.72-1.51 1.46v1.76h2.57l-.41 2.9h-2.16V22c4.78-.76 8.44-4.91 8.44-9.93z"/></svg>
              </SocialIcon>

              <SocialIcon label="YouTube">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.2s-.2-1.6-.8-2.3c-.7-.9-1.5-.9-1.9-1C17.4 2.5 12 2.5 12 2.5h-.1s-5.4 0-8.8.4c-.4 0-1.2 0-1.9 1C.7 4.6.5 6.2.5 6.2S.2 8 .2 9.8v1.4c0 1.8.3 3.6.3 3.6s.2 1.6.8 2.3c.7.9 1.7.9 2.1 1 1.5.2 6.3.4 6.3.4s5.4 0 8.8-.4c.4 0 1.2 0 1.9-1 .6-.7.8-2.3.8-2.3s.3-1.8.3-3.6V9.8c0-1.8-.3-3.6-.3-3.6zM9.8 14.6V7.4l6 3.6-6 3.6z"/></svg>
              </SocialIcon>

              <SocialIcon label="X">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.6 7.1c-.2.8-.8 1.6-1.6 2.1l-2.2 1.5 3 4.9c.3.6.2 1.4-.3 1.9-.3.3-.7.4-1.1.4-.3 0-.6-.1-.9-.2l-3.6-1.6-3 2.2c-.5.3-1.2.3-1.7 0-.5-.3-.8-.9-.7-1.5l.5-4-4.2-2.9c-.6-.4-.9-1.1-.7-1.8.1-.7.6-1.3 1.3-1.5l5.8-1.7L7.8 4.1c-.4-.2-.7-.7-.6-1.2.1-.5.5-.9 1-.9.3 0 .6.1.8.3L16 7l3.2-1.1c.7-.2 1.4 0 1.9.5.5.5.7 1.2.5 1.7z"/></svg>
              </SocialIcon>

              <SocialIcon label="LINE">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 2H3C1.9 2 1 2.9 1 4v12c0 1.1.9 2 2 2h3v4l4-4h11c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              </SocialIcon>

              <SocialIcon label="TikTok">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2v10.5c0 .8-.7 1.5-1.5 1.5-2.2 0-4-1.8-4-4V9C6.5 9 5 10.6 5 12.5 5 15 7 17 9.5 17c1.6 0 3-.8 3.9-2.2V22c.7.1 1.3.1 2 .1 0-1.7 0-10.8 0-13.9h2.6V6.1C17.7 6 16 6 15 5.5V2h-3z"/></svg>
              </SocialIcon>

              <SocialIcon label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 2h10c2.8 0 5 2.2 5 5v10c0 2.8-2.2 5-5 5H7c-2.8 0-5-2.2-5-5V7c0-2.8 2.2-5 5-5zm5 6.3A4.7 4.7 0 1 0 16.7 13 4.7 4.7 0 0 0 12 8.3zm6.3-.7a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1z"/></svg>
              </SocialIcon>
            </div>
          </div>

          <div className="banner-section">
            <img src='https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blt49a498b8bb67c346/68ef10e20823481cd44e88f2/cybersafe-icon-EN_4X.jpg' width={'350px'}></img>
          </div>
        </div>

        <div className="footer-legal">
          <div className="copyright">©True Corporation Public Company Limited. All rights reserved.</div>
          <div className="legal-links">
            <span>Privacy Policy</span>
            <span>Terms and Conditions</span>
            <span>Compliance with Regulations</span>
          </div>
        </div>

        <button className="to-top" onClick={handleTop} aria-label="Back to top">^
          <span className="top-text">TOP</span>
        </button>
      </div>
    </footer>
  )
}

export default Footer