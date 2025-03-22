import { ButtonHTMLAttributes, ReactNode } from 'react';
import { theme } from '@/styles/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded transition-colors duration-200';
  
  const variantStyles = {
    primary: 'bg-[#2B6CB0] text-white hover:bg-[#2C5282]',
    secondary: 'bg-[#38A169] text-white hover:bg-[#2F855A]',
    outline: 'border-2 border-[#2B6CB0] text-[#2B6CB0] hover:bg-[#2B6CB0] hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
      onClick={onClick}
    >
      {children}
    </button>
  );
} 