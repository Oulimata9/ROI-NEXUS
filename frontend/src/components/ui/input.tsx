import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded-md border border-gray-200 bg-white text-sm placeholder-gray-400 ${className}`}
      {...props}
    />
  );
});
Input.displayName = 'Input';