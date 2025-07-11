import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiShoppingBag, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiHeart,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, toggleCart, getTotalItems } = useCartStore();

  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Brands', href: '/brands' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-elegant border-b border-gray-100' 
          : 'bg-white'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-luxury rounded-lg flex items-center justify-center">
                <span className="text-white font-luxury font-bold text-xl">L</span>
              </div>
              <span className="font-luxury text-2xl font-bold text-gradient hidden sm:block">
                LUXE
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href={item.href}
                  className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search luxury products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-200 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-luxury-charcoal hover:text-luxury-gold transition-colors duration-200"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <motion.button
              className="relative p-2 text-luxury-charcoal hover:text-luxury-gold transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHeart className="w-6 h-6" />
            </motion.button>

            {/* Cart */}
            <motion.button
              onClick={toggleCart}
              className="relative p-2 text-luxury-charcoal hover:text-luxury-gold transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-luxury-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated && user ? (
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-luxury-pearl transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-luxury rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.firstName?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block text-luxury-charcoal font-medium">
                    {user.firstName}
                  </span>
                </motion.button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="luxury" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-luxury-lg border border-gray-100 py-2"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center space-x-2 px-4 py-2 text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiShoppingBag className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-luxury-charcoal hover:bg-luxury-pearl transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-luxury-charcoal hover:text-luxury-gold transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-100 py-4"
            >
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-200 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-luxury-charcoal"
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </form>

                {/* Mobile Nav Items */}
                {navigationItems.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="block py-2 text-luxury-charcoal hover:text-luxury-gold transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;