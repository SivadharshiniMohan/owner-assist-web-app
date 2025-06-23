import React from 'react';
import logo from './../../public/e-cargo-logo.png';
import log1 from './../../public/favicon.png';
const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center">
        {/* Desktop Logo */}
        <div className="hidden md:block">
          <img 
            src={logo} 
            alt="E-CARGO" 
            className="h-8"
          />
        </div>
        
        {/* Mobile Logo */}
        <div className="block md:hidden">
          <img 
            src={log1}
            alt="E-CARGO" 
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
