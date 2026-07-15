import React from 'react';

export default function EmblemAngola({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className} rounded-none bg-transparent`} id="emblem-container">
      <img
        src="/LOGO.MININT.jpeg"
        alt="Logótipo do Ministério do Interior"
        className="w-full h-full object-contain rounded-none bg-transparent"
      />
    </div>
  );
}
