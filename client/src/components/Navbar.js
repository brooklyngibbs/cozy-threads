import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, X } from 'lucide-react';
import Logo from './Logo';

const Navbar = ({ cartCount, onCartClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Top Banner */}
      <div className="bg-amber-900 text-amber-50 py-2 text-center text-sm">
        Free shipping on orders over $100
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Search and Cart */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {isSearchOpen ? (
                <form 
                  onSubmit={handleSearch}
                  className="absolute right-0 top-1/2 -translate-y-1/2 
                            flex items-center bg-amber-50 rounded-full pr-2"
                >
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-64 px-4 py-2 bg-transparent text-amber-900 
                             placeholder-amber-400 focus:outline-none text-sm"
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchTerm('');
                    }}
                    className="p-1 hover:bg-amber-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-amber-900" />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-amber-50 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-amber-900" />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 bg-amber-100 px-4 py-2 
                       rounded-full hover:bg-amber-200 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-amber-900" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-900 text-white 
                             w-5 h-5 rounded-full text-xs flex items-center 
                             justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;