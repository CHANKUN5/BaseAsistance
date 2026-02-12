import React from 'react';

const Card = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white border-slate-200',
    glass: 'bg-white/70 backdrop-blur-md border-white/20 shadow-xl'
  };

  return (
    <div className={`${variants[variant] || variants.default} rounded-xl border overflow-hidden transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ title, subtitle, className = '', children }) => {
  return (
    <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent };
