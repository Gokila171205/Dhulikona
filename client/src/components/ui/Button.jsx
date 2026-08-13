import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gov-blue text-white hover:bg-gov-light focus:ring-gov-blue',
    secondary: 'bg-water-blue text-white hover:bg-water-light focus:ring-water-blue',
    outline: 'border border-gov-blue text-gov-blue hover:bg-gov-blue hover:text-white focus:ring-gov-blue',
    danger: 'bg-danger text-white hover:bg-red-700 focus:ring-danger',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
