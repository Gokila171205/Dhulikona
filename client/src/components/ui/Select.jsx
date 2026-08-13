import React from 'react';

const Select = React.forwardRef(({ label, error, options, className = '', ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gov-blue focus:border-gov-blue bg-white
          ${error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-gray-300'}
          disabled:bg-gray-100 disabled:text-gray-500`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
