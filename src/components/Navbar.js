import React from 'react';
import './Navbar.css';

const Navbar = ({ account, toggleDarkMode }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <button
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        onClick={() => window.location.reload()}
        style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'white' }}
      >
        EthSwap
      </button>
      <div className="ml-auto d-flex align-items-center justify-content-end account-section">
        <span className="navbar-text text-white account-address">
          {account}
        </span>
        <button id="theme-switch" onClick={toggleDarkMode} className="btn-darkmode">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20">
            <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
