import React from 'react';
import { motion } from 'framer-motion';
import { ButtonProps } from '@/types';

const Button: React.FC<ButtonProps> = ({
  variant = 'luxury',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    luxury: 'bg-gradient-luxury text-white hover:shadow-luxury-lg focus:ring-luxury-gold/50',
    elegant: 'bg-luxury-charcoal text-white hover:bg-gray-800 hover:shadow-elegant-lg focus:ring-gray-500',
    outline: 'border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white hover:shadow-luxury focus:ring-luxury-gold/50',
    ghost: 'text-luxury-charcoal hover:bg-luxury-pearl focus:ring-gray-300',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none';
  const fullWidthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? disabledClasses : 'hover:scale-105 active:scale-95'}
    ${fullWidthClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {isLoading ? (
        <>
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;