import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, className }) => {
  return (
    <label className={cn("flex items-center gap-2 cursor-pointer group", className)}>
      <div 
        onClick={onChange}
        className={cn(
          "w-5 h-5 rounded border transition-all flex items-center justify-center",
          checked 
            ? "bg-[#013220] border-[#013220]" 
            : "border-[#E0E0E0] group-hover:border-[#013220] bg-white"
        )}
      >
        {checked && <Check size={14} className="text-white" strokeWidth={3} />}
      </div>
      {label && <span className="text-sm text-[#1A1A1A] select-none">{label}</span>}
    </label>
  );
};
