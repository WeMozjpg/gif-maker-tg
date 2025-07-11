import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { InputProps } from '@/types';

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
}, ref) => {
  const inputId = React.useId();

  return (
    <motion.div 
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-luxury-charcoal"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <motion.input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            input-luxury
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
          `.trim().replace(/\s+/g, ' ')}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />
        
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <svg 
              className="w-5 h-5 text-red-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </motion.div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;