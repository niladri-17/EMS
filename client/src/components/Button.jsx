import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  leftIcon = null,
  rightIcon = null
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 flex items-center justify-center';
  
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-5',
    lg: 'py-3 px-6 text-lg',
    xl: 'py-4 px-8 text-xl'
  };
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-700 text-white shadow-md hover:shadow-lg active:shadow-sm',
    secondary: 'bg-white border border-gray-300 text-secondary hover:bg-gray-50 active:bg-gray-100',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary-50 active:bg-primary-100',
    success: 'bg-success hover:bg-success-dark text-white shadow-md hover:shadow-lg active:shadow-sm',
    danger: 'bg-danger hover:bg-danger-dark text-white shadow-md hover:shadow-lg active:shadow-sm',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 active:bg-gray-200',
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'active:scale-95';
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const animationProps = disabled ? {} : {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  };
  
  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${widthClasses} ${className}`}
      disabled={disabled}
      {...animationProps}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;