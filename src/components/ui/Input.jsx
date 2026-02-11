import React from 'react';

const Input = ({ className = '', error, ...props }) => {
    return (
        <div className="w-full">
            <input
                className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
