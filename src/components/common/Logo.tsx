import React from 'react';

export type LogoVariant = 'orange' | 'blue' | 'purple';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: LogoVariant;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'orange',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      box: 'w-7 h-7',
      text: 'text-base font-bold',
      iconSize: 18,
    },
    md: {
      box: 'w-8 h-8',
      text: 'text-lg font-bold',
      iconSize: 22,
    },
    lg: {
      box: 'w-10 h-10',
      text: 'text-xl font-bold',
      iconSize: 26,
    },
    xl: {
      box: 'w-12 h-12',
      text: 'text-2xl font-bold',
      iconSize: 32,
    },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Clean, distinctive brand insignia */}
      <div
        className={`${current.box} rounded-xl bg-gradient-to-tr from-orange-600 via-amber-600 to-orange-500 text-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4/5 h-4/5 text-white"
        >
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
      </div>

      {/* Single clean wordmark: strictly adhering to Top Bar Contract */}
      {showText && (
        <span className={`tracking-tight ${current.text} text-slate-900 dark:text-white`}>
          Lingua<span className="text-orange-600 dark:text-orange-400">Learn</span>
        </span>
      )}
    </div>
  );
};
