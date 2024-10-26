import React from 'react';
import './Navbar.css';

const Navbar = ({ account }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <button
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        onClick={() => window.location.reload()}
        style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'white' }}
      >
        EthSwap
      </button>
      <span className="navbar-text text-white account-address">
        {account}
      </span>
    </nav>
  );
};

export default Navbar;
