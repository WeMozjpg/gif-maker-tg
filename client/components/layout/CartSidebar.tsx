import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';

const CartSidebar: React.FC = () => {
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    getShipping,
    getTax,
    getFinalTotal
  } = useCartStore();

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const shipping = getShipping();
  const tax = getTax();
  const total = getFinalTotal();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-50"
          />
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-luxury-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-luxury font-semibold text-luxury-charcoal">
                Shopping Cart ({totalItems})
              </h2>
              <motion.button
                onClick={toggleCart}
                className="p-2 hover:bg-luxury-pearl rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto scrollbar-luxury">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 bg-luxury-pearl rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-luxury-charcoal mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add some luxury items to get started
                  </p>
                  <Link href="/products">
                    <Button onClick={toggleCart}>
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 bg-luxury-pearl rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden">
                        {item.product.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <FiShoppingBag className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-luxury-charcoal truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.product.brand}
                        </p>
                        <p className="font-semibold text-luxury-gold">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-luxury-gold transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiMinus className="w-3 h-3" />
                        </motion.button>
                        
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <motion.button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-luxury-gold transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiPlus className="w-3 h-3" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => removeItem(item.product._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiX className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Totals and Checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-luxury-gold">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button fullWidth variant="luxury" onClick={toggleCart}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button fullWidth variant="outline" onClick={toggleCart}>
                      View Cart Details
                    </Button>
                  </Link>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-luxury-pearl p-3 rounded-lg text-center text-sm"
                  >
                    <p className="text-luxury-charcoal">
                      Add <span className="font-semibold text-luxury-gold">
                        {formatPrice(100 - subtotal)}
                      </span> more for free shipping!
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;