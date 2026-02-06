import './Input.css';

export default function Input({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    error = '',
    required = false,
    disabled = false,
    autoComplete,
    icon = null,
    className = '',
    ...props
}) {
    const inputId = `input-${name}`;

    const wrapperClasses = [
        'input-wrapper',
        error && 'input-wrapper--error',
        disabled && 'input-wrapper--disabled',
        icon && 'input-wrapper--with-icon',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className="input-container">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    id={inputId}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className="input-field"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
            </div>
            {error && (
                <span id={`${inputId}-error`} className="input-error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
