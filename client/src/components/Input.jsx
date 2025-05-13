import { motion } from 'framer-motion';
import { useState } from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  error = '',
  success = false,
  leftIcon = null,
  rightIcon = null,
  helperText = '',
  className = '' 
}) => {
  const [focused, setFocused] = useState(false);
  
  const getStatusClasses = () => {
    if (error) {
      return 'border-danger focus:ring-danger/30 focus:border-danger';
    } else if (success) {
      return 'border-success focus:ring-success/30 focus:border-success';
    } else if (focused) {
      return 'border-primary focus:ring-primary/30 focus:border-primary';
    } else {
      return 'border-gray-300 focus:ring-primary/30 focus:border-primary';
    }
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <motion.input
          whileFocus={{ scale: 1.005 }}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full border-2 rounded-lg py-3 transition-all duration-200 ${
            leftIcon ? 'pl-10' : 'pl-4'
          } ${
            rightIcon ? 'pr-10' : 'pr-4'
          } ${getStatusClasses()}`}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`mt-1 text-sm ${error ? 'text-danger' : 'text-gray-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;