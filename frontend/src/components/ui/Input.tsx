import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    fullWidth = true,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`glass-input w-full ${error ? 'border-error focus:ring-error' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-error animate-fade-in">
                    {error}
                </p>
            )}
        </div>
    );
};
