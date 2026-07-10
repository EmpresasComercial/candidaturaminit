import React from 'react';
import logoReal from '../assets/logo.jpg';

export default function EmblemAngola({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} id="emblem-container">
      <img
        src={logoReal}
        alt="Logótipo do Ministério do Interior"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
