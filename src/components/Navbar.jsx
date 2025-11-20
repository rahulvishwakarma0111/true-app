import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar-inner">
          <nav className="top-links">
            <a href="#" style={{fontSize: '16px'}}>Our Company</a>
            <a href="#" style={{fontSize: '16px'}}>Corporate Customer</a>
            <a href="#" style={{fontSize: '16px'}}>Find True Shop</a>
          </nav>
          <div className="top-right">
            <img src='https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blt4a88971de999d1e3/App_Icon.svg' height={'28px'} width={'28px'}></img>
            <div className="app-label">True App</div>
          </div>
        </div>
      </div>

      <div className="mainbar">
        <div className="mainbar-inner">
          <div className="logo">
            <img
              src="https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blt9a3c4613ba3a3eec/68111a30ecbf964b0e907070/Isolation_Mode.svg?branch=develop"
              alt="True logo"
              className="logo-img"
            />
          </div>

          <nav className="nav-items">
            <a href="#">Packages &amp; Promotion</a>
            <a href="#">Home Internet</a>
            <a href="#">Online Store</a>
            <a href="#">Customer Services</a>
            <a href="#">Privileges</a>
            <a href="#">Network and Technology</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar