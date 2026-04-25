import React, { forwardRef, type CSSProperties } from 'react';
import { cn } from './utils';

type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'destructive';
type ButtonSize = 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-200',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-200',
  outline:
    'border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-slate-200',
  destructive:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-200'
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: '1px solid #2563eb'
  },
  ghost: {},
  outline: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #cbd5e1'
  },
  destructive: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: '1px solid #dc2626'
  }
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  default: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-10 w-10 p-0'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      disabled,
      type = 'button',
      variant = 'primary',
      size = 'default',
      style,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:pointer-events-none [&_svg]:shrink-0',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
