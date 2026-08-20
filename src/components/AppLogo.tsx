import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  alt?: string;
}

/** Shared app brand mark — uses the canonical dictionary icon asset. */
export const AppLogo: React.FC<AppLogoProps> = ({
  size = 56,
  className = '',
  alt = 'শব্দকোষ',
}) => {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icon.png`}
      width={size}
      height={size}
      alt={alt}
      draggable={false}
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 rounded-full select-none object-contain drop-shadow-[2px_3px_5px_rgba(34,49,77,0.3)] hover:scale-105 active:scale-95 transition-transform ${className}`}
    />
  );
};
