import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'terracotta' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'pill';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asMotion?: boolean;
}

const variantStyles: Record<string, string> = {
  default: 'bg-[#D97757] text-white hover:bg-[#C86646] shadow-md shadow-[#D97757]/20 border border-transparent active:scale-[0.98]',
  terracotta: 'bg-[#D97757] text-white hover:bg-[#C86646] shadow-lg shadow-[#D97757]/25 border border-[#D97757]/30 hover:border-[#D97757]/50 active:scale-[0.98]',
  secondary: 'bg-[#22211C] text-[#ECE7DF] hover:bg-[#2A2923] hover:text-white border border-[#33312B] hover:border-[#48453C] shadow-sm active:scale-[0.98]',
  outline: 'bg-transparent text-[#ECE7DF] hover:bg-[#22211C] hover:text-white border border-[#33312B] hover:border-[#48453C] active:scale-[0.98]',
  ghost: 'bg-transparent text-[#A39D93] hover:text-[#ECE7DF] hover:bg-[#1E1D19] border border-transparent active:scale-[0.98]',
  glass: 'bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/15 hover:ring-white/25 backdrop-blur-md shadow-sm active:scale-[0.98]',
  destructive: 'bg-red-600/90 text-white hover:bg-red-700 border border-red-500/30 shadow-sm shadow-red-900/20 active:scale-[0.98]',
};

const sizeStyles: Record<string, string> = {
  default: 'h-10 px-4 py-2 text-xs font-medium rounded-xl',
  sm: 'h-8 px-3 py-1.5 text-xs font-medium rounded-lg',
  lg: 'h-12 px-6 py-3 text-sm font-semibold rounded-2xl',
  pill: 'h-10 px-5 py-2 text-xs font-medium rounded-full',
  icon: 'h-9 w-9 p-0 flex items-center justify-center rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const combinedClassName = cn(
      'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97757] disabled:pointer-events-none disabled:opacity-50 cursor-pointer font-sans',
      variantStyles[variant] || variantStyles.default,
      sizeStyles[size] || sizeStyles.default,
      className
    );

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
