import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiShoppingBag, FiTruck, FiShield, FiAward } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Product } from '@/types';

// Mock data for featured products
const featuredProducts: Product[] = [
  {
    _id: '1',
    name: 'Royal Diamond Watch',
    description: 'Exquisite timepiece crafted with precision',
    price: 15999,
    originalPrice: 18999,
    category: { _id: '1', name: 'Watches', slug: 'watches', isActive: true },
    brand: 'Rolex',
    images: [{ _id: '1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', alt: 'Royal Diamond Watch', isMain: true, order: 0 }],
    stock: 5,
    sku: 'RDW001',
    tags: ['luxury', 'diamond', 'watch'],
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 127,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: '2',
    name: 'BMW i8 Coupe',
    description: 'The future of luxury driving',
    price: 147500,
    category: { _id: '2', name: 'Automotive', slug: 'automotive', isActive: true },
    brand: 'BMW',
    images: [{ _id: '2', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e', alt: 'BMW i8 Coupe', isMain: true, order: 0 }],
    stock: 2,
    sku: 'BMW001',
    tags: ['luxury', 'car', 'electric'],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 89,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: '3',
    name: 'Platinum Necklace',
    description: 'Handcrafted platinum jewelry',
    price: 8999,
    originalPrice: 10999,
    category: { _id: '3', name: 'Jewelry', slug: 'jewelry', isActive: true },
    brand: 'Tiffany & Co',
    images: [{ _id: '3', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', alt: 'Platinum Necklace', isMain: true, order: 0 }],
    stock: 8,
    sku: 'PN001',
    tags: ['luxury', 'platinum', 'jewelry'],
    isActive: true,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 203,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: '4',
    name: 'Designer Handbag',
    description: 'Limited edition luxury handbag',
    price: 3999,
    category: { _id: '4', name: 'Fashion', slug: 'fashion', isActive: true },
    brand: 'Louis Vuitton',
    images: [{ _id: '4', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', alt: 'Designer Handbag', isMain: true, order: 0 }],
    stock: 12,
    sku: 'LV001',
    tags: ['luxury', 'fashion', 'handbag'],
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 156,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Luxury Redefined",
      subtitle: "Discover the finest collection of premium products",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      cta: "Explore Collection"
    },
    {
      title: "BMW Excellence",
      subtitle: "Experience the ultimate driving machine",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
      cta: "View Vehicles"
    },
    {
      title: "Timeless Elegance",
      subtitle: "Swiss-made timepieces for the discerning collector",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      cta: "Shop Watches"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.1
            }}
            transition={{ duration: 1 }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}
        
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <motion.div
            className="container-luxury"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-luxury font-bold mb-6"
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-200"
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/products">
                <Button size="lg" className="text-lg px-12 py-4">
                  {heroSlides[currentSlide].cta}
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-luxury-gold scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-luxury-pearl">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FiTruck,
                title: "Free Shipping",
                description: "Complimentary shipping on orders over $100"
              },
              {
                icon: FiShield,
                title: "Secure Payment",
                description: "Your transactions are protected with bank-level security"
              },
              {
                icon: FiAward,
                title: "Premium Quality",
                description: "Only the finest products from trusted luxury brands"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-luxury-charcoal mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-luxury">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-luxury font-bold text-luxury-charcoal mb-6">
              Featured Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of luxury products from the world's most prestigious brands
            </p>
          </motion.div>

          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                className="card-luxury hover-lift group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      SALE
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 font-medium">
                      {product.brand}
                    </span>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <FiStar className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-luxury-charcoal mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-luxury-gold">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <Button size="sm" variant="outline">
                      <FiShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/products">
              <Button size="lg">
                View All Products
                <FiArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-gradient-luxury text-white">
        <div className="container-luxury text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-luxury font-bold mb-6">
              Stay in Touch
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Be the first to know about new arrivals and exclusive offers
            </p>
            
            <div className="max-w-md mx-auto flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-luxury-charcoal focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button variant="elegant">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;