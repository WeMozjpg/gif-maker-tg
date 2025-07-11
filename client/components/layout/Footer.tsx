import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiShield
} from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/products" },
        { name: "Watches", href: "/categories/watches" },
        { name: "Jewelry", href: "/categories/jewelry" },
        { name: "Automotive", href: "/categories/automotive" },
        { name: "Fashion", href: "/categories/fashion" },
        { name: "Sale", href: "/sale" }
      ]
    },
    {
      title: "Customer Service",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Size Guide", href: "/size-guide" },
        { name: "Shipping Info", href: "/shipping" },
        { name: "Returns", href: "/returns" },
        { name: "FAQ", href: "/faq" },
        { name: "Track Order", href: "/track" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Partnerships", href: "/partnerships" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Terms", href: "/terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: FiFacebook, href: "https://facebook.com", name: "Facebook" },
    { icon: FiTwitter, href: "https://twitter.com", name: "Twitter" },
    { icon: FiInstagram, href: "https://instagram.com", name: "Instagram" },
    { icon: FiLinkedin, href: "https://linkedin.com", name: "LinkedIn" }
  ];

  return (
    <footer className="bg-luxury-charcoal text-white">
      {/* Main Footer Content */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-gradient-luxury rounded-lg flex items-center justify-center">
                  <span className="text-white font-luxury font-bold text-2xl">L</span>
                </div>
                <span className="font-luxury text-3xl font-bold text-gradient">
                  LUXE
                </span>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-md">
                Discover the world's finest luxury products. From Swiss timepieces to premium automobiles, 
                we curate only the best for discerning customers who appreciate true craftsmanship.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiPhone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiMail className="w-4 h-4" />
                  <span>hello@luxe.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FiMapPin className="w-4 h-4" />
                  <span>Fifth Avenue, New York, NY 10001</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-700 hover:bg-luxury-gold flex items-center justify-center transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Navigation */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-lg mb-6 text-luxury-gold">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-luxury-gold transition-colors duration-200 block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md">
            <h3 className="font-semibold text-lg mb-4 text-luxury-gold">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to receive exclusive offers and latest updates
            </p>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all duration-300"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-luxury text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-luxury-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="container-luxury py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} LUXE. All rights reserved. Crafted with excellence.
            </div>

            {/* Payment Methods & Security */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FiCreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-sm">SSL Protected</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-luxury-gold transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-luxury-gold transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-luxury-gold transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;