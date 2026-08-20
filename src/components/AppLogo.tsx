import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 56, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-block shrink-0 rounded-full select-none cursor-pointer hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <img
        src="/icon.png"
        alt="শব্দকোষ"
        width={size}
        height={size}
        draggable={false}
        className="w-full h-full filter drop-shadow-[2px_3px_5px_rgba(34,49,77,0.3)]"
      />
    </div>
  );
};
