import React from 'react';
import { BASE_URL } from '../../services/apiService';

interface LogoProps {
  className?: string;
  src?: string;
  alt?: string;
}

export const Logo = ({ className = "w-12 h-12", src, alt = "MK Store" }: LogoProps) => {
  if (src) {
    // If the src starts with 'backend/uploads', prepend the API URL base
    const fullSrc = src.startsWith('http') ? src : `${BASE_URL}/${src}`;
    return <img src={fullSrc} alt={alt} className={`${className} object-contain`} />;
  }

  return (
    <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, -10)">
        {/* M */}
        <path d="M 100 170 L 100 100 C 100 90, 105 85, 115 85 L 140 85 L 170 140 L 200 85 L 225 85 C 235 85, 240 90, 240 100 L 240 170 L 210 170 L 210 125 L 180 170 L 160 170 L 130 125 L 130 170 Z" fill="#013220"/>
        
        {/* K */}
        <path d="M 250 170 L 250 85 L 280 85 L 280 130 L 315 85 L 355 85 L 310 135 L 360 170 L 320 170 L 280 140 L 280 170 Z" fill="#013220"/>

        {/* Green Leaf on M */}
        <path d="M 100 95 C 100 55, 130 45, 165 60 C 180 67, 190 80, 190 95 C 170 80, 140 75, 100 95 Z" fill="#013220"/>
        {/* Inner leaf detail */}
        <path d="M 130 75 C 145 70, 160 75, 170 85" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        
        {/* Gold Leaf on K */}
        <path d="M 280 130 C 290 85, 325 65, 370 70 C 385 72, 395 85, 385 100 C 360 90, 320 95, 280 130 Z" fill="#C9A227"/>
        {/* Inner leaf detail */}
        <path d="M 315 95 C 335 85, 355 85, 370 90" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>

        {/* Text: MK Store */}
        <text x="200" y="235" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="64" fill="#013220" textAnchor="middle" letterSpacing="-1">MK Store</text>

        {/* Text: FRESH GROCERIES • KERALA */}
        <text x="200" y="265" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="16" fill="#C9A227" textAnchor="middle" letterSpacing="2">FRESH GROCERIES • KERALA</text>
      </g>
    </svg>
  );
};
