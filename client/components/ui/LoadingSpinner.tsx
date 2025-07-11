import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'gold' | 'charcoal' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'gold',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    gold: 'border-luxury-gold',
    charcoal: 'border-luxury-charcoal',
    white: 'border-white',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-2 border-t-transparent rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;