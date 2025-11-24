import React, { use } from 'react'
import './Navbar.css'
import { href, useNavigate } from 'react-router-dom';

const link = 'https://business.true.th/en/home?_gl=1*kvblng*_gcl_au*MTA5MzYxOTAzMS4xNzYzNTMzMDA4*_ga*MTU3NjE0MDA0My4xNzYzNTMzMDA5*_ga_KB786LL39X*czE3NjM5Nzk2MjQkbzExJGcxJHQxNzYzOTgwNDE3JGo1MCRsMCRoMA..'

const link2 = 'https://iservice.true.th/store-locator?_gl=1*16zoivh*_gcl_au*MTA5MzYxOTAzMS4xNzYzNTMzMDA4*_ga*MTU3NjE0MDA0My4xNzYzNTMzMDA5*_ga_KB786LL39X*czE3NjM5Nzk2MjQkbzExJGcxJHQxNzYzOTgwNDE3JGo1MCRsMCRoMA..'

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <nav className="top-links">
            <a href="https://www.true.th/our-company" style={{ fontSize: '16px' }} target='_blank'>Our Company</a>
            <a href={link} style={{ fontSize: '16px' }} target='_blank'>Corporate Customer</a>
            <a href={link2} style={{ fontSize: '16px' }} target='_blank'>Find True Shop</a>
          </nav>
          <div className="top-right">
            <img src='https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blt4a88971de999d1e3/App_Icon.svg' height={'28px'} width={'28px'}></img>
            <div
              className="app-label"
              onClick={() => {
                window.location.href = "https://www.true.th/services/true-app";
              }}
            >True App</div>
          </div>
        </div>
      </div>

      <div className="mainbar">
        <div className="mainbar-inner">
          <div className="logo" onClick={() => navigate('/')}>
            <img
              src="https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blt9a3c4613ba3a3eec/68111a30ecbf964b0e907070/Isolation_Mode.svg?branch=develop"
              alt="True logo"
              style={{ cursor: 'pointer' }}
              className="logo-img"
            />
          </div>

          <nav className="nav-items">
            <a href="https://www.true.th/en" target='_blank'>Packages &amp; Promotion</a>
            <a href="https://www.true.th/en" target='_blank'>Home Internet</a>
            <a href="/" target='_self'>Online Store</a>
            <a href="https://www.true.th/en" target='_blank'>Customer Services</a>
            <a href="https://www.true.th/privilege" target='_blank'>Privileges</a>
            <a href="https://www.true.th/true-network" target='_blank'>Network and Technology</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar