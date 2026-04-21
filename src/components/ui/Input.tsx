import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  floatingLabel?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, floatingLabel, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';
    const isPassword = props.type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type;

    if (floatingLabel && label) {
      return (
        <div className="w-full relative">
          <div className="relative">
            {icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6B6B]">
                {icon}
              </div>
            )}
            <input
              ref={ref}
              className={cn(
                "flex h-14 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 pt-5 pb-1 text-sm transition-colors peer",
                "focus:outline-none focus:ring-2 focus:ring-[#013220]/20 focus:border-[#013220]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                icon && "pl-10",
                isPassword && "pr-10",
                error && "border-[#E53935] focus:ring-[#E53935]/20 focus:border-[#E53935]",
                className
              )}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              {...props}
              type={inputType}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B6B6B] hover:text-[#013220] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            <label 
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none text-[#6B6B6B]",
                icon && "left-10",
                (isFocused || hasValue) ? "top-2 text-xs text-[#013220]" : "top-4 text-sm"
              )}
            >
              {label}
            </label>
          </div>
          {error && (
            <p className="mt-1.5 text-sm text-[#E53935]">{error}</p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6B6B]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-2 text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-[#013220]/20 focus:border-[#013220]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              isPassword && "pr-10",
              error && "border-[#E53935] focus:ring-[#E53935]/20 focus:border-[#E53935]",
              className
            )}
            {...props}
            type={inputType}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6B6B6B] hover:text-[#013220] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[#E53935]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
